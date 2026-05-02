import type { ScheduleEntry } from "../types";

// =============================================================================
// ICS — Apple Calendar / generic
// =============================================================================

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatICSDate(d: Date) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

const DAY_TO_RRULE: Record<number, string> = {
  0: "SU",
  1: "MO",
  2: "TU",
  3: "WE",
  4: "TH",
  5: "FR",
  6: "SA",
};

export function buildICS(entries: ScheduleEntry[]) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MediGuard//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:MediGuard",
    "X-WR-TIMEZONE:UTC",
  ];

  entries.forEach((entry) => {
    entry.times.forEach((time, i) => {
      const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
      const start = new Date(entry.startsOn);
      start.setHours(hh, mm, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 15);

      const dtStamp = formatICSDate(new Date());
      const uid = `mediguard-${entry.id}-${i}@mediguard.app`;

      const days = entry.daysOfWeek.map((d) => DAY_TO_RRULE[d]).join(",");

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtStamp}`);
      lines.push(`DTSTART:${formatICSDate(start)}`);
      lines.push(`DTEND:${formatICSDate(end)}`);
      lines.push(`SUMMARY:Take ${entry.medicationName} (${entry.dosage})`);
      lines.push(
        `DESCRIPTION:MediGuard reminder${entry.withFood ? "\\nTake with food" : ""}`
      );
      lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${days}`);
      if (entry.remindersOn) {
        lines.push("BEGIN:VALARM");
        lines.push("ACTION:DISPLAY");
        lines.push(`DESCRIPTION:${entry.medicationName} dose in 15 minutes`);
        lines.push("TRIGGER:-PT15M");
        lines.push("END:VALARM");
      }
      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(entries: ScheduleEntry[]) {
  const ics = buildICS(entries);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mediguard-schedule.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// =============================================================================
// GOOGLE CALENDAR — single event URL (one per dose)
// =============================================================================

export function buildGoogleCalendarUrl(entry: ScheduleEntry, time: string) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  const start = new Date(entry.startsOn);
  start.setHours(hh, mm, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);

  const fmt = (d: Date) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z";

  const days = entry.daysOfWeek.map((d) => DAY_TO_RRULE[d]).join(",");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Take ${entry.medicationName} (${entry.dosage})`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `MediGuard reminder${entry.withFood ? "\nTake with food" : ""}`,
    recur: `RRULE:FREQ=WEEKLY;BYDAY=${days}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
