"use client";

import { useState } from "react";
import { CalendarDays, Plus, Bell, BellOff, Check, Coffee, Sun, Sunset, Moon } from "lucide-react";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";

interface Dose {
  id: string;
  time: string;
  meds: { name: string; dosage: string; color: string }[];
  taken?: boolean;
  withFood?: boolean;
}

const TODAY: Dose[] = [
  {
    id: "d1",
    time: "8:00 AM",
    meds: [
      { name: "Atorvastatin", dosage: "10 mg", color: "white" },
      { name: "Vitamin D3", dosage: "2000 IU", color: "yellow" },
    ],
    taken: true,
    withFood: true,
  },
  {
    id: "d2",
    time: "1:00 PM",
    meds: [{ name: "Metformin", dosage: "500 mg", color: "white" }],
    taken: true,
    withFood: true,
  },
  {
    id: "d3",
    time: "7:00 PM",
    meds: [{ name: "Metformin", dosage: "500 mg", color: "white" }],
    withFood: true,
  },
  {
    id: "d4",
    time: "9:30 PM",
    meds: [{ name: "Omega-3", dosage: "1000 mg", color: "amber" }],
  },
];

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function timeIcon(time: string) {
  const hour = parseInt(time.split(":")[0], 10);
  const isPm = time.includes("PM");
  const h24 = isPm && hour !== 12 ? hour + 12 : hour === 12 && !isPm ? 0 : hour;
  if (h24 < 11) return Coffee;
  if (h24 < 16) return Sun;
  if (h24 < 20) return Sunset;
  return Moon;
}

export default function SchedulePage() {
  const [doses, setDoses] = useState<Dose[]>(TODAY);
  const [calendarSync, setCalendarSync] = useState<"none" | "apple" | "google">("none");
  const [reminders, setReminders] = useState(true);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const completed = doses.filter((d) => d.taken).length;

  function toggle(id: string) {
    setDoses(doses.map((d) => (d.id === id ? { ...d, taken: !d.taken } : d)));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
            {completed} of {doses.length} doses taken today
          </p>
          <h1 className="font-display text-display-md text-ink-950">Schedule</h1>
        </div>
        <button className="btn-primary px-5 py-2.5 text-sm self-start md:self-auto">
          <Plus className="w-4 h-4" />
          Add dose
        </button>
      </header>

      {/* Week strip */}
      <LiquidGlass variant="default" className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - dayOfWeek + i);
            const isToday = i === dayOfWeek;
            return (
              <button
                key={i}
                className={cn(
                  "py-3 rounded-2xl flex flex-col items-center gap-1 transition-all",
                  isToday ? "bg-teal-600 text-white shadow-soft" : "hover:bg-white/40 text-ink-700"
                )}
              >
                <span className={cn("text-[10px] font-mono uppercase tracking-wider", isToday ? "text-white/80" : "text-ink-500")}>
                  {day}
                </span>
                <span className={cn("font-display text-lg", isToday && "font-medium")}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </LiquidGlass>

      {/* Sync + reminders bar */}
      <div className="grid md:grid-cols-2 gap-3">
        <LiquidGlass variant="tint" className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-teal-700 flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar sync
          </p>
          <p className="font-display text-lg text-ink-950 mt-2 mb-3">
            {calendarSync === "none" ? "Not connected" : calendarSync === "apple" ? "Apple Calendar" : "Google Calendar"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCalendarSync(calendarSync === "apple" ? "none" : "apple")}
              className={cn(
                "glass-button px-4 py-2 text-xs",
                calendarSync === "apple" && "!bg-teal-500/15 !text-teal-700"
              )}
            >
              Apple
            </button>
            <button
              onClick={() => setCalendarSync(calendarSync === "google" ? "none" : "google")}
              className={cn(
                "glass-button px-4 py-2 text-xs",
                calendarSync === "google" && "!bg-teal-500/15 !text-teal-700"
              )}
            >
              Google
            </button>
          </div>
        </LiquidGlass>

        <LiquidGlass variant="tint" className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-coral-700 flex items-center gap-2">
            {reminders ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            Reminders
          </p>
          <p className="font-display text-lg text-ink-950 mt-2 mb-3">
            {reminders ? "15 min before each dose" : "Off"}
          </p>
          <button
            onClick={() => setReminders(!reminders)}
            className={cn("glass-button px-4 py-2 text-xs", reminders && "!bg-coral-500/15 !text-coral-700")}
          >
            {reminders ? "Disable" : "Enable"}
          </button>
        </LiquidGlass>
      </div>

      {/* Today's timeline */}
      <div className="space-y-3 mt-2">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-display text-2xl text-ink-950">Today</h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        <ol className="relative space-y-3">
          <span className="absolute left-7 top-8 bottom-8 w-px bg-ink-200/60" />

          {doses.map((dose) => {
            const Icon = timeIcon(dose.time);
            return (
              <li key={dose.id} className="relative">
                <LiquidGlass
                  variant={dose.taken ? "default" : "tint"}
                  className={cn(
                    "p-5 flex items-center gap-4 transition-all",
                    dose.taken && "opacity-70"
                  )}
                >
                  <div className="relative shrink-0">
                    <span
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-2xl shadow-soft",
                        dose.taken
                          ? "bg-gradient-to-br from-teal-500 to-teal-700"
                          : "bg-gradient-to-br from-ink-100 to-ink-200"
                      )}
                    >
                      {dose.taken ? (
                        <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                      ) : (
                        <Icon className="w-5 h-5 text-ink-700" strokeWidth={2} />
                      )}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono text-sm text-ink-700 tabular-nums">{dose.time}</p>
                      {dose.withFood && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500">· with food</span>
                      )}
                    </div>
                    {dose.meds.map((med, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <p className={cn("font-display text-base", dose.taken ? "text-ink-700 line-through" : "text-ink-950")}>
                          {med.name}
                        </p>
                        <span className="font-mono text-xs text-ink-500">{med.dosage}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => toggle(dose.id)}
                    className={cn(
                      "shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all",
                      dose.taken
                        ? "text-ink-500 hover:text-ink-700"
                        : "btn-primary !px-4 !py-2"
                    )}
                  >
                    {dose.taken ? "Undo" : "Mark taken"}
                  </button>
                </LiquidGlass>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
