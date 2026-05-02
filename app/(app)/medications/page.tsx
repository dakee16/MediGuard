"use client";

import { useState } from "react";
import { Pill, Plus, ShoppingBag, AlertCircle, Search, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../lib/auth-context";
import { useMedications, deleteMedication, updateMedication } from "../../../lib/data";
import { AddMedicationModal } from "../../../components/medications/add-medication-modal";
import { AuthGate } from "../../../components/auth/auth-gate";
import type { Medication, MarketListing } from "../../../types";

const MOCK_LISTINGS: Record<string, MarketListing[]> = {
  Atorvastatin: [
    { id: "a1", medicationName: "Atorvastatin 10mg", vendor: "CVS", price: 14.99, unit: "30 tablets", shipping: "Free in 2 days" },
    { id: "a2", medicationName: "Atorvastatin 10mg", vendor: "Amazon Pharmacy", price: 12.49, unit: "30 tablets", shipping: "Free Prime" },
    { id: "a3", medicationName: "Atorvastatin 10mg", vendor: "Costco", price: 9.99, unit: "30 tablets", shipping: "Members" },
  ],
  "Omega-3": [
    { id: "o1", medicationName: "Omega-3 1000mg", vendor: "CVS", price: 22.99, unit: "60 capsules" },
    { id: "o2", medicationName: "Omega-3 1000mg", vendor: "Amazon Pharmacy", price: 18.49, unit: "60 capsules", shipping: "Free Prime" },
    { id: "o3", medicationName: "Omega-3 1000mg", vendor: "Walgreens", price: 24.49, unit: "60 capsules" },
  ],
  "Vitamin D3": [
    { id: "v1", medicationName: "Vitamin D3 2000IU", vendor: "Amazon Pharmacy", price: 8.99, unit: "60 capsules", shipping: "Free Prime" },
    { id: "v2", medicationName: "Vitamin D3 2000IU", vendor: "CVS", price: 11.99, unit: "60 capsules" },
  ],
  Metformin: [
    { id: "m1", medicationName: "Metformin 500mg", vendor: "Costco", price: 14.49, unit: "60 tablets", shipping: "Members" },
    { id: "m2", medicationName: "Metformin 500mg", vendor: "Walgreens", price: 18.99, unit: "60 tablets" },
  ],
};

export default function MedicationsPage() {
  return (
    <AuthGate>
      <MedicationsContent />
    </AuthGate>
  );
}

function MedicationsContent() {
  const { user, isDemo } = useAuth();
  const { meds, loading } = useMedications(user?.uid ?? null, isDemo);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = meds.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase()));
  const refillCount = meds.filter(
    (m) => (m.pillsRemaining ?? 0) <= (m.refillThreshold ?? 0)
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
            {meds.length} medications · {refillCount} need refill
          </p>
          <h1 className="font-display text-display-md text-ink-950">Your Medications</h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="btn-primary px-5 py-2.5 text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add medication
        </button>
      </header>

      <LiquidGlass variant="default" className="p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-ink-500 ml-2" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search your medications…"
          className="flex-1 bg-transparent border-none outline-none text-sm text-ink-900 placeholder:text-ink-500"
        />
      </LiquidGlass>

      {loading && (
        <div className="flex items-center justify-center py-16 text-ink-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.map((med) => (
            <MedicationCard
              key={med.id}
              med={med}
              expanded={expandedId === med.id}
              onToggle={() => setExpandedId(expandedId === med.id ? null : med.id)}
              uid={user!.uid}
              isDemo={isDemo}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && meds.length > 0 && (
        <LiquidGlass variant="tint" className="p-12 text-center">
          <Pill className="w-8 h-8 text-ink-400 mx-auto mb-4" />
          <p className="font-display text-xl text-ink-950">No medications found</p>
          <p className="text-sm text-ink-600 mt-1">Try a different search.</p>
        </LiquidGlass>
      )}

      {!loading && meds.length === 0 && (
        <LiquidGlass variant="tint" className="p-12 text-center">
          <Pill className="w-10 h-10 text-teal-500 mx-auto mb-4" />
          <p className="font-display text-2xl text-ink-950">Nothing here yet</p>
          <p className="text-sm text-ink-600 mt-1 max-w-sm mx-auto">
            Add your first medication to start tracking doses, refills, and reminders.
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="btn-primary px-5 py-2.5 text-sm mt-6"
          >
            <Plus className="w-4 h-4" />
            Add medication
          </button>
        </LiquidGlass>
      )}

      {user && (
        <AddMedicationModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          uid={user.uid}
          isDemo={isDemo}
        />
      )}
    </div>
  );
}

function MedicationCard({
  med,
  expanded,
  onToggle,
  uid,
  isDemo,
}: {
  med: Medication;
  expanded: boolean;
  onToggle: () => void;
  uid: string;
  isDemo: boolean;
}) {
  const lowSupply = (med.pillsRemaining ?? 0) <= (med.refillThreshold ?? 0);
  const supplyPercent = Math.min(
    100,
    ((med.pillsRemaining ?? 0) / Math.max(1, (med.refillThreshold ?? 0) * 3)) * 100
  );
  const listings = MOCK_LISTINGS[med.name] ?? [];

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete ${med.name}?`)) return;
    await deleteMedication(uid, isDemo, med.id);
  }

  async function handleAdjust(delta: number) {
    const next = Math.max(0, (med.pillsRemaining ?? 0) + delta);
    await updateMedication(uid, isDemo, med.id, { pillsRemaining: next });
  }

  return (
    <LiquidGlass
      variant={expanded ? "strong" : "default"}
      className={cn("transition-all duration-300", expanded && "shadow-glass-lg")}
    >
      <button onClick={onToggle} className="w-full text-left p-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-soft",
              med.color === "white"
                ? "from-ink-100 to-ink-200"
                : med.color === "yellow"
                ? "from-yellow-200 to-yellow-300"
                : med.color === "amber"
                ? "from-amber-300 to-amber-500"
                : med.color === "coral"
                ? "from-coral-300 to-coral-500"
                : "from-teal-300 to-teal-500"
            )}
          >
            <Pill className="w-5 h-5 text-ink-700" strokeWidth={2} />
          </div>
          {lowSupply && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral-500 border-2 border-ink-50 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display text-lg text-ink-950 truncate">{med.name}</p>
            <span className="font-mono text-xs text-ink-500">{med.dosage}</span>
          </div>
          <p className="text-xs text-ink-600 mt-0.5">{med.uses?.[0] ?? med.form}</p>
        </div>

        <div className="text-right shrink-0">
          <p
            className={cn(
              "font-mono text-sm tabular-nums",
              lowSupply ? "text-coral-700" : "text-ink-700"
            )}
          >
            {med.pillsRemaining ?? 0}
          </p>
          <p className="text-[10px] font-mono uppercase tracking-wider text-ink-500">left</p>
        </div>
      </button>

      <div className="px-5 pb-4">
        <div className="h-1 rounded-full bg-ink-100 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              lowSupply
                ? "bg-gradient-to-r from-coral-400 to-coral-500"
                : "bg-gradient-to-r from-teal-400 to-teal-500"
            )}
            style={{ width: `${supplyPercent}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-ink-200/60 space-y-4">
          {lowSupply && (
            <div className="flex items-center gap-2 text-coral-700 bg-coral-50/60 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">Running low — refill recommended this week.</p>
            </div>
          )}

          {/* Quick adjust */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">
              Adjust supply
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdjust(-1);
              }}
              className="glass-button !px-3 !py-1 !text-sm"
            >
              −1
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdjust(-7);
              }}
              className="glass-button !px-3 !py-1 !text-sm"
            >
              −7
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdjust(30);
              }}
              className="glass-button !px-3 !py-1 !text-sm"
            >
              +30
            </button>
            <button
              onClick={handleDelete}
              className="ml-auto glass-button !px-3 !py-1 !text-sm !text-coral-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                Refill marketplace
              </p>
              <p className="text-[10px] font-mono text-ink-500">Live prices</p>
            </div>

            {listings.length > 0 ? (
              <div className="space-y-2">
                {listings
                  .sort((a, b) => a.price - b.price)
                  .map((listing, i) => (
                    <a
                      key={listing.id}
                      href={`https://www.google.com/search?q=${encodeURIComponent(listing.medicationName + " " + listing.vendor)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "w-full glass-button !rounded-2xl !justify-between p-4 group",
                        i === 0 && "!bg-teal-500/10"
                      )}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="font-display text-sm text-ink-950">{listing.vendor}</span>
                        {i === 0 && (
                          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-600 text-white">
                            Best price
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono text-sm tabular-nums text-ink-900">
                            ${listing.price.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-ink-500">{listing.unit}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-ink-500 group-hover:text-ink-900" />
                      </div>
                    </a>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-ink-500 italic">
                No live listings for this medication. Try the Pharmacy tab to search vendors directly.
              </p>
            )}
          </div>
        </div>
      )}
    </LiquidGlass>
  );
}
