"use client";

import { useState } from "react";
import { MapPin, ShoppingBag, Search, Phone, Clock, Star, Navigation } from "lucide-react";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";
import type { Pharmacy, MarketListing } from "../../../types";

const NEARBY_PHARMACIES: Pharmacy[] = [
  { id: "1", name: "CVS Pharmacy", address: "120 W College Ave", distance: "0.4 mi", rating: 4.2, open: true, hours: "Open until 10 PM", phone: "(814) 234-1980", lat: 40.7934, lng: -77.8600 },
  { id: "2", name: "Rite Aid", address: "224 W Beaver Ave", distance: "0.6 mi", rating: 4.0, open: true, hours: "Open until 9 PM", phone: "(814) 237-9900", lat: 40.7938, lng: -77.8624 },
  { id: "3", name: "Wegmans Pharmacy", address: "345 Colonnade Way", distance: "1.2 mi", rating: 4.7, open: true, hours: "Open until 9 PM", phone: "(814) 235-4400", lat: 40.8003, lng: -77.8765 },
  { id: "4", name: "Giant Pharmacy", address: "2222 N Atherton St", distance: "2.1 mi", rating: 4.3, open: false, hours: "Opens at 9 AM", phone: "(814) 234-9620", lat: 40.8245, lng: -77.8735 },
];

const MARKETPLACE_LISTINGS: MarketListing[] = [
  { id: "1", medicationName: "Atorvastatin 10mg", vendor: "Costco", price: 9.99, unit: "30 tablets", shipping: "Members" },
  { id: "2", medicationName: "Atorvastatin 10mg", vendor: "Amazon Pharmacy", price: 12.49, unit: "30 tablets", shipping: "Free Prime" },
  { id: "3", medicationName: "Vitamin D3 2000IU", vendor: "CVS", price: 11.99, unit: "60 capsules" },
  { id: "4", medicationName: "Vitamin D3 2000IU", vendor: "Amazon Pharmacy", price: 8.99, unit: "60 capsules", shipping: "Free Prime" },
  { id: "5", medicationName: "Metformin 500mg", vendor: "Walgreens", price: 18.99, unit: "60 tablets" },
  { id: "6", medicationName: "Metformin 500mg", vendor: "Costco", price: 14.49, unit: "60 tablets", shipping: "Members" },
  { id: "7", medicationName: "Omega-3 1000mg", vendor: "Amazon Pharmacy", price: 18.49, unit: "60 capsules", shipping: "Free Prime" },
  { id: "8", medicationName: "Levothyroxine 50mcg", vendor: "GoodRx", price: 7.99, unit: "30 tablets" },
];

type Tab = "nearby" | "buy";

export default function PharmacyPage() {
  const [tab, setTab] = useState<Tab>("nearby");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
          State College, PA · Live data
        </p>
        <h1 className="font-display text-display-md text-ink-950">Pharmacy</h1>
      </header>

      {/* Liquid glass segmented tab bar */}
      <LiquidGlass variant="strong" className="!rounded-full p-1 grid grid-cols-2 gap-1 max-w-md">
        <button
          onClick={() => setTab("nearby")}
          className={cn(
            "py-2.5 rounded-full font-medium text-sm transition-all relative",
            tab === "nearby" ? "bg-white text-ink-900 shadow-soft" : "text-ink-600"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nearby
          </span>
        </button>
        <button
          onClick={() => setTab("buy")}
          className={cn(
            "py-2.5 rounded-full font-medium text-sm transition-all relative",
            tab === "buy" ? "bg-white text-ink-900 shadow-soft" : "text-ink-600"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Buy online
          </span>
        </button>
      </LiquidGlass>

      {tab === "nearby" && <NearbyTab pharmacies={NEARBY_PHARMACIES} />}
      {tab === "buy" && <BuyTab listings={MARKETPLACE_LISTINGS} search={search} onSearch={setSearch} />}
    </div>
  );
}

function NearbyTab({ pharmacies }: { pharmacies: Pharmacy[] }) {
  return (
    <div className="grid md:grid-cols-5 gap-4">
      {/* Map placeholder — drop in @react-google-maps/api here */}
      <LiquidGlass variant="strong" className="md:col-span-3 overflow-hidden p-0 min-h-[420px] relative">
        {/* Decorative map illustration */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-ink-50 to-coral-50">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#52b3a6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
            <path d="M 0 200 Q 200 180 400 220 T 600 250" stroke="#82cdc1" strokeWidth="6" fill="none" opacity="0.4" />
            <path d="M 100 0 Q 130 200 110 420" stroke="#82cdc1" strokeWidth="4" fill="none" opacity="0.3" />
            <path d="M 350 0 Q 380 220 360 420" stroke="#82cdc1" strokeWidth="4" fill="none" opacity="0.3" />
          </svg>

          {/* Pharmacy pins */}
          {pharmacies.map((p, i) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                top: `${20 + (i * 18) % 70}%`,
                left: `${15 + (i * 23) % 70}%`,
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-full">
                <div className="glass-strong rounded-full px-3 py-1.5 text-xs font-medium text-ink-900 shadow-glass mb-2 whitespace-nowrap">
                  {p.name}
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft flex items-center justify-center mx-auto">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="w-1 h-1 rounded-full bg-teal-700 mx-auto -mt-0.5" />
              </div>
            </div>
          ))}

          {/* You marker */}
          <div className="absolute top-[55%] left-[42%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-4 h-4">
              <span className="absolute inset-0 rounded-full bg-coral-500 animate-ping opacity-40" />
              <span className="relative w-full h-full rounded-full bg-coral-500 border-2 border-white block" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 glass-button !w-10 !h-10 !p-0">
          <Navigation className="w-4 h-4" />
        </div>
        <div className="absolute top-4 left-4 glass-strong px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-ink-700">
          Live map
        </div>
      </LiquidGlass>

      {/* Pharmacy list */}
      <div className="md:col-span-2 space-y-3">
        {pharmacies.map((p) => (
          <LiquidGlass key={p.id} variant="default" className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-ink-950 truncate">{p.name}</p>
                <p className="text-xs text-ink-600 truncate">{p.address}</p>
              </div>
              <span className="font-mono text-xs text-teal-700 shrink-0">{p.distance}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-ink-600 mb-3">
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-coral-400 stroke-coral-400" />
                {p.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className={cn(p.open ? "text-teal-700" : "text-coral-700")}>{p.hours}</span>
              </span>
            </div>

            <div className="flex gap-2">
              <button className="glass-button px-3 py-1.5 text-xs flex-1">
                <Navigation className="w-3 h-3" />
                Directions
              </button>
              <button className="glass-button px-3 py-1.5 text-xs flex-1">
                <Phone className="w-3 h-3" />
                Call
              </button>
            </div>
          </LiquidGlass>
        ))}
      </div>
    </div>
  );
}

function BuyTab({
  listings,
  search,
  onSearch,
}: {
  listings: MarketListing[];
  search: string;
  onSearch: (s: string) => void;
}) {
  const filtered = search
    ? listings.filter((l) => l.medicationName.toLowerCase().includes(search.toLowerCase()))
    : listings;

  // Group by medication
  const grouped = filtered.reduce<Record<string, MarketListing[]>>((acc, l) => {
    if (!acc[l.medicationName]) acc[l.medicationName] = [];
    acc[l.medicationName].push(l);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <LiquidGlass variant="default" className="p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-ink-500 ml-2" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search any medication…"
          className="flex-1 bg-transparent border-none outline-none text-sm text-ink-900 placeholder:text-ink-500"
        />
      </LiquidGlass>

      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-500">
        {Object.keys(grouped).length} medications · {filtered.length} listings
      </p>

      <div className="space-y-5">
        {Object.entries(grouped).map(([med, options]) => (
          <div key={med}>
            <h3 className="font-display text-xl text-ink-950 mb-3 px-1">{med}</h3>
            <div className="grid gap-2">
              {options.sort((a, b) => a.price - b.price).map((listing, i) => (
                <LiquidGlass key={listing.id} variant="default" className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm text-ink-950">{listing.vendor}</p>
                      {i === 0 && (
                        <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-600 text-white">
                          Best price
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {listing.unit}
                      {listing.shipping && <span className="text-teal-700"> · {listing.shipping}</span>}
                    </p>
                  </div>
                  <p className="font-mono text-base tabular-nums text-ink-900">${listing.price.toFixed(2)}</p>
                  <button className="btn-primary !py-2 !px-4 !text-xs">Buy</button>
                </LiquidGlass>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
