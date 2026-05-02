"use client";

import type { ScheduleEntry } from "../types";

// =============================================================================
// PERMISSION
// =============================================================================

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

// =============================================================================
// SCHEDULING — uses setTimeout chain for upcoming doses
// =============================================================================

let scheduledTimers: number[] = [];

function clearTimers() {
  scheduledTimers.forEach((t) => clearTimeout(t));
  scheduledTimers = [];
}

function fireNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "mediguard-dose",
    });
  } catch (err) {
    console.error("[notify]", err);
  }
}

/**
 * Compute the next occurrence of a given time (HH:mm) on one of the allowed days,
 * minus 15 minutes for the reminder.
 */
function nextReminderTime(time: string, daysOfWeek: number[]): Date | null {
  const now = new Date();
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));

  // Check today and the next 7 days
  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    candidate.setHours(hh, mm, 0, 0);

    // Subtract 15 minutes for the reminder
    const reminder = new Date(candidate);
    reminder.setMinutes(reminder.getMinutes() - 15);

    if (reminder > now && daysOfWeek.includes(candidate.getDay())) {
      return reminder;
    }
  }
  return null;
}

export function scheduleAllReminders(entries: ScheduleEntry[]) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  clearTimers();

  entries
    .filter((e) => e.remindersOn)
    .forEach((entry) => {
      entry.times.forEach((time) => {
        const fireAt = nextReminderTime(time, entry.daysOfWeek);
        if (!fireAt) return;

        const delay = fireAt.getTime() - Date.now();
        // setTimeout max ~24.8 days; we only schedule within ~7 days max
        if (delay <= 0 || delay > 8 * 24 * 60 * 60 * 1000) return;

        const timerId = window.setTimeout(() => {
          fireNotification(
            `${entry.medicationName} in 15 min`,
            `${entry.dosage}${entry.withFood ? " · with food" : ""}`
          );
        }, delay);

        scheduledTimers.push(timerId);
      });
    });
}

export function cancelAllReminders() {
  clearTimers();
}

/**
 * Test notification — fires one immediately so the user knows reminders work.
 */
export function fireTestNotification() {
  fireNotification(
    "MediGuard reminders are on",
    "You'll get a quiet nudge 15 min before each dose."
  );
}
