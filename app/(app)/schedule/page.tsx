"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Bell,
  BellOff,
  Check,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Trash2,
  Loader2,
  Apple,
  Download,
} from "lucide-react";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../lib/auth-context";
import {
  useSchedule,
  useMedications,
  useDoseLog,
  deleteScheduleEntry,
  updateScheduleEntry,
} from "../../../lib/data";
import { AddDoseModal } from "../../../components/schedule/add-dose-modal";
import { AuthGate } from "../../../components/auth/auth-gate";
import { downloadICS } from "../../../lib/calendar";
import {
  requestNotificationPermission,
  scheduleAllReminders,
  fireTestNotification,
  getNotificationPermission,
} from "../../../lib/notifications";
import type { ScheduleEntry } from "../../../types";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function SchedulePage() {
  return (
    <AuthGate>
      <ScheduleContent />
    </AuthGate>
  );
}

function ScheduleContent() {
  const { user, isDemo } = useAuth();
  const uid = user!.uid;
  const { entries, loading } = useSchedule(uid, isDemo);
  const { meds } = useMedications(uid, isDemo);
  const { log, setLog } = useDoseLog(uid);

  const [addOpen, setAddOpen] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">(
    "default"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Initialize notification permission state on mount
  useEffect(() => {
    setNotifPerm(getNotificationPermission());
  }, []);

  // Schedule notifications whenever entries change
  useEffect(() => {
    if (notifPerm === "granted") {
      scheduleAllReminders(entries);
    }
  }, [entries, notifPerm]);

  // Build today's doses from schedule entries
  const todaysDoses = useMemo(() => buildDoses(entries, selectedDate), [entries, selectedDate]);
  const completed = todaysDoses.filter((d) => log.takenIds.includes(d.key)).length;

  async function enableReminders() {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      fireTestNotification();
      scheduleAllReminders(entries);
    } else if (perm === "denied") {
      alert(
        "Notifications were blocked. Enable them in your browser settings to get dose reminders."
      );
    }
  }

  function toggleTaken(key: string) {
    if (log.takenIds.includes(key)) {
      setLog({ ...log, takenIds: log.takenIds.filter((k) => k !== key) });
    } else {
      setLog({ ...log, takenIds: [...log.takenIds, key] });
    }
  }

  async function handleDelete(entry: ScheduleEntry) {
    if (!confirm(`Remove the schedule for ${entry.medicationName}?`)) return;
    await deleteScheduleEntry(uid, isDemo, entry.id);
  }

  async function handleToggleReminders(entry: ScheduleEntry) {
    await updateScheduleEntry(uid, isDemo, entry.id, { remindersOn: !entry.remindersOn });
  }

  function handleAppleSync() {
    downloadICS(entries);
  }

  function handleGoogleSync() {
    if (entries.length === 0) {
      alert("Add a dose first.");
      return;
    }
    // Open Google Calendar with the first entry; users can add multiple
    const url = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
      "https://mediguard.app/schedule.ics"
    )}`;
    window.open(url, "_blank");
    alert(
      "We've also downloaded an .ics file you can import into Google Calendar (Settings → Import & export)."
    );
    downloadICS(entries);
  }

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
            {completed} of {todaysDoses.length} doses taken{" "}
            {sameDay(selectedDate, today) ? "today" : ""}
          </p>
          <h1 className="font-display text-display-md text-ink-950">Schedule</h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="btn-primary px-5 py-2.5 text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add dose
        </button>
      </header>

      {/* Week strip */}
      <LiquidGlass variant="default" className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day, i) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const isSelected = sameDay(date, selectedDate);
            const isToday = sameDay(date, today);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "py-3 rounded-2xl flex flex-col items-center gap-1 transition-all",
                  isSelected
                    ? "bg-teal-600 text-white shadow-soft"
                    : "hover:bg-white/40 text-ink-700"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-wider",
                    isSelected ? "text-white/80" : "text-ink-500"
                  )}
                >
                  {day}
                </span>
                <span
                  className={cn(
                    "font-display text-lg",
                    (isSelected || isToday) && "font-medium"
                  )}
                >
                  {date.getDate()}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-teal-600" />
                )}
              </button>
            );
          })}
        </div>
      </LiquidGlass>

      {/* Sync + reminders */}
      <div className="grid md:grid-cols-2 gap-3">
        <LiquidGlass variant="tint" className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-teal-700 flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar export
          </p>
          <p className="font-display text-lg text-ink-950 mt-2 mb-3">
            Export your schedule
          </p>
          <p className="text-xs text-ink-600 mb-3">
            Subscribe in Apple Calendar or import to Google Calendar.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAppleSync}
              disabled={entries.length === 0}
              className="glass-button px-4 py-2 text-xs disabled:opacity-50"
            >
              <Apple className="w-3.5 h-3.5" />
              Apple Calendar
            </button>
            <button
              onClick={handleGoogleSync}
              disabled={entries.length === 0}
              className="glass-button px-4 py-2 text-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Google Calendar
            </button>
          </div>
        </LiquidGlass>

        <LiquidGlass variant="tint" className="p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-coral-700 flex items-center gap-2">
            {notifPerm === "granted" ? (
              <Bell className="w-3.5 h-3.5" />
            ) : (
              <BellOff className="w-3.5 h-3.5" />
            )}
            Reminders
          </p>
          <p className="font-display text-lg text-ink-950 mt-2 mb-3">
            {notifPerm === "granted"
              ? "On — 15 min before each dose"
              : notifPerm === "denied"
              ? "Blocked in browser"
              : notifPerm === "unsupported"
              ? "Not supported here"
              : "Off"}
          </p>
          {notifPerm !== "granted" && notifPerm !== "unsupported" && (
            <button onClick={enableReminders} className="glass-button px-4 py-2 text-xs">
              Enable reminders
            </button>
          )}
          {notifPerm === "granted" && (
            <button
              onClick={() => fireTestNotification()}
              className="glass-button px-4 py-2 text-xs"
            >
              Send test
            </button>
          )}
        </LiquidGlass>
      </div>

      {/* Timeline */}
      <div className="space-y-3 mt-2">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-display text-2xl text-ink-950">
            {sameDay(selectedDate, today) ? "Today" : selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500">
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-ink-500">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        {!loading && todaysDoses.length === 0 && (
          <LiquidGlass variant="tint" className="p-12 text-center">
            <CalendarDays className="w-10 h-10 text-teal-500 mx-auto mb-4" />
            <p className="font-display text-2xl text-ink-950">No doses scheduled</p>
            <p className="text-sm text-ink-600 mt-1 max-w-sm mx-auto">
              {meds.length === 0
                ? "Add a medication first, then schedule when you take it."
                : "Schedule a dose to see it here."}
            </p>
            <button
              onClick={() => setAddOpen(true)}
              disabled={meds.length === 0}
              className="btn-primary px-5 py-2.5 text-sm mt-6 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add dose
            </button>
          </LiquidGlass>
        )}

        {!loading && todaysDoses.length > 0 && (
          <ol className="relative space-y-3">
            <span className="absolute left-7 top-8 bottom-8 w-px bg-ink-200/60" />

            {todaysDoses.map((dose) => {
              const Icon = timeIcon(dose.time);
              const taken = log.takenIds.includes(dose.key);
              return (
                <li key={dose.key} className="relative">
                  <LiquidGlass
                    variant={taken ? "default" : "tint"}
                    className={cn("p-5 flex items-center gap-4 transition-all", taken && "opacity-70")}
                  >
                    <div className="relative shrink-0">
                      <span
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-2xl shadow-soft",
                          taken
                            ? "bg-gradient-to-br from-teal-500 to-teal-700"
                            : "bg-gradient-to-br from-ink-100 to-ink-200"
                        )}
                      >
                        {taken ? (
                          <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                        ) : (
                          <Icon className="w-5 h-5 text-ink-700" strokeWidth={2} />
                        )}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-mono text-sm text-ink-700 tabular-nums">
                          {formatTime12(dose.time)}
                        </p>
                        {dose.withFood && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
                            · with food
                          </span>
                        )}
                        {!dose.remindersOn && (
                          <BellOff className="w-3 h-3 text-ink-400" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p
                          className={cn(
                            "font-display text-base",
                            taken ? "text-ink-700 line-through" : "text-ink-950"
                          )}
                        >
                          {dose.medicationName}
                        </p>
                        <span className="font-mono text-xs text-ink-500">{dose.dosage}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleReminders(dose.entry)}
                        className="hidden sm:inline-flex w-9 h-9 rounded-full bg-white/60 hover:bg-white/90 items-center justify-center text-ink-500 hover:text-ink-700 transition-colors"
                        title="Toggle reminder"
                      >
                        {dose.remindersOn ? (
                          <Bell className="w-3.5 h-3.5" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(dose.entry)}
                        className="hidden sm:inline-flex w-9 h-9 rounded-full bg-white/60 hover:bg-coral-100 items-center justify-center text-ink-500 hover:text-coral-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleTaken(dose.key)}
                        className={cn(
                          "px-3 py-2 rounded-full text-xs font-medium transition-all",
                          taken ? "text-ink-500 hover:text-ink-700" : "btn-primary !px-4 !py-2"
                        )}
                      >
                        {taken ? "Undo" : "Mark taken"}
                      </button>
                    </div>
                  </LiquidGlass>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {user && (
        <AddDoseModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          uid={uid}
          isDemo={isDemo}
          medications={meds}
        />
      )}
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

interface DoseInstance {
  key: string;
  entry: ScheduleEntry;
  medicationName: string;
  dosage: string;
  time: string;
  withFood?: boolean;
  remindersOn: boolean;
}

function buildDoses(entries: ScheduleEntry[], date: Date): DoseInstance[] {
  const day = date.getDay();
  const doses: DoseInstance[] = [];

  entries.forEach((entry) => {
    if (!entry.daysOfWeek.includes(day)) return;
    entry.times.forEach((time) => {
      doses.push({
        key: `${entry.id}:${time}`,
        entry,
        medicationName: entry.medicationName,
        dosage: entry.dosage,
        time,
        withFood: entry.withFood,
        remindersOn: entry.remindersOn,
      });
    });
  });

  return doses.sort((a, b) => a.time.localeCompare(b.time));
}

function timeIcon(time: string) {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 11) return Coffee;
  if (hour < 16) return Sun;
  if (hour < 20) return Sunset;
  return Moon;
}

function formatTime12(time: string) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${h12}:${String(mm).padStart(2, "0")} ${period}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
