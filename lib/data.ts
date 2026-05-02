"use client";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import type { Medication, ScheduleEntry } from "../types";
import { useEffect, useState } from "react";

// =============================================================================
// LOCAL STORAGE FALLBACK
// =============================================================================

function lsKey(uid: string, kind: "meds" | "schedule") {
  return `mediguard:${uid}:${kind}`;
}

function lsRead<T>(uid: string, kind: "meds" | "schedule"): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(lsKey(uid, kind));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function lsWrite<T>(uid: string, kind: "meds" | "schedule", data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(lsKey(uid, kind), JSON.stringify(data));
  // Dispatch a custom event so other tabs/components can listen
  window.dispatchEvent(new CustomEvent(`mediguard:${kind}-change`, { detail: { uid } }));
}

// Seed demo data so the demo user starts with realistic content
const DEMO_SEED_MEDS: Medication[] = [
  {
    id: "demo-1",
    name: "Atorvastatin",
    dosage: "10 mg",
    form: "tablet",
    color: "white",
    uses: ["Cholesterol management"],
    pillsRemaining: 8,
    refillThreshold: 10,
    addedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Vitamin D3",
    dosage: "2000 IU",
    form: "capsule",
    color: "yellow",
    uses: ["Bone health", "Immune support"],
    pillsRemaining: 42,
    refillThreshold: 14,
    addedAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Metformin",
    dosage: "500 mg",
    form: "tablet",
    color: "white",
    uses: ["Type 2 diabetes"],
    pillsRemaining: 25,
    refillThreshold: 14,
    addedAt: new Date().toISOString(),
  },
];

const DEMO_SEED_SCHEDULE: ScheduleEntry[] = [
  {
    id: "demo-s1",
    medicationId: "demo-1",
    medicationName: "Atorvastatin",
    dosage: "10 mg",
    times: ["08:00"],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    withFood: true,
    startsOn: new Date().toISOString(),
    remindersOn: true,
  },
  {
    id: "demo-s2",
    medicationId: "demo-3",
    medicationName: "Metformin",
    dosage: "500 mg",
    times: ["13:00", "19:00"],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    withFood: true,
    startsOn: new Date().toISOString(),
    remindersOn: true,
  },
];

function ensureDemoSeed(uid: string) {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(lsKey(uid, "meds"));
  if (existing === null) {
    lsWrite(uid, "meds", DEMO_SEED_MEDS);
    lsWrite(uid, "schedule", DEMO_SEED_SCHEDULE);
  }
}

// =============================================================================
// MEDICATIONS
// =============================================================================

export function useMedications(uid: string | null, isDemo: boolean) {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setMeds([]);
      setLoading(false);
      return;
    }

    // Firestore mode
    if (firebaseEnabled && db && !isDemo) {
      const ref = collection(db, "users", uid, "medications");
      const q = query(ref, orderBy("addedAt", "desc"));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Medication[];
          setMeds(items);
          setLoading(false);
        },
        (err) => {
          console.error("[meds]", err);
          setLoading(false);
        }
      );
      return () => unsub();
    }

    // Local storage mode
    ensureDemoSeed(uid);
    const reload = () => setMeds(lsRead<Medication>(uid, "meds"));
    reload();
    setLoading(false);

    const handler = () => reload();
    window.addEventListener("mediguard:meds-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mediguard:meds-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [uid, isDemo]);

  return { meds, loading };
}

export async function addMedication(
  uid: string,
  isDemo: boolean,
  med: Omit<Medication, "id" | "addedAt">
) {
  const payload = { ...med, addedAt: new Date().toISOString() };

  if (firebaseEnabled && db && !isDemo) {
    const ref = collection(db, "users", uid, "medications");
    await addDoc(ref, { ...payload, addedAt: serverTimestamp() });
    return;
  }

  const meds = lsRead<Medication>(uid, "meds");
  const newMed: Medication = { ...payload, id: `m-${Date.now()}` };
  lsWrite(uid, "meds", [newMed, ...meds]);
}

export async function updateMedication(
  uid: string,
  isDemo: boolean,
  id: string,
  updates: Partial<Medication>
) {
  if (firebaseEnabled && db && !isDemo) {
    await updateDoc(doc(db, "users", uid, "medications", id), updates);
    return;
  }

  const meds = lsRead<Medication>(uid, "meds");
  lsWrite(
    uid,
    "meds",
    meds.map((m) => (m.id === id ? { ...m, ...updates } : m))
  );
}

export async function deleteMedication(uid: string, isDemo: boolean, id: string) {
  if (firebaseEnabled && db && !isDemo) {
    await deleteDoc(doc(db, "users", uid, "medications", id));
    return;
  }

  const meds = lsRead<Medication>(uid, "meds");
  lsWrite(
    uid,
    "meds",
    meds.filter((m) => m.id !== id)
  );
}

// =============================================================================
// SCHEDULE
// =============================================================================

export function useSchedule(uid: string | null, isDemo: boolean) {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setEntries([]);
      setLoading(false);
      return;
    }

    if (firebaseEnabled && db && !isDemo) {
      const ref = collection(db, "users", uid, "schedule");
      const unsub = onSnapshot(
        ref,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ScheduleEntry[];
          setEntries(items);
          setLoading(false);
        },
        (err) => {
          console.error("[schedule]", err);
          setLoading(false);
        }
      );
      return () => unsub();
    }

    ensureDemoSeed(uid);
    const reload = () => setEntries(lsRead<ScheduleEntry>(uid, "schedule"));
    reload();
    setLoading(false);

    const handler = () => reload();
    window.addEventListener("mediguard:schedule-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mediguard:schedule-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [uid, isDemo]);

  return { entries, loading };
}

export async function addScheduleEntry(
  uid: string,
  isDemo: boolean,
  entry: Omit<ScheduleEntry, "id">
) {
  if (firebaseEnabled && db && !isDemo) {
    const ref = collection(db, "users", uid, "schedule");
    await addDoc(ref, entry);
    return;
  }

  const entries = lsRead<ScheduleEntry>(uid, "schedule");
  const newEntry: ScheduleEntry = { ...entry, id: `s-${Date.now()}` };
  lsWrite(uid, "schedule", [...entries, newEntry]);
}

export async function updateScheduleEntry(
  uid: string,
  isDemo: boolean,
  id: string,
  updates: Partial<ScheduleEntry>
) {
  if (firebaseEnabled && db && !isDemo) {
    await updateDoc(doc(db, "users", uid, "schedule", id), updates);
    return;
  }

  const entries = lsRead<ScheduleEntry>(uid, "schedule");
  lsWrite(
    uid,
    "schedule",
    entries.map((e) => (e.id === id ? { ...e, ...updates } : e))
  );
}

export async function deleteScheduleEntry(uid: string, isDemo: boolean, id: string) {
  if (firebaseEnabled && db && !isDemo) {
    await deleteDoc(doc(db, "users", uid, "schedule", id));
    return;
  }

  const entries = lsRead<ScheduleEntry>(uid, "schedule");
  lsWrite(
    uid,
    "schedule",
    entries.filter((e) => e.id !== id)
  );
}

// =============================================================================
// DAILY LOG (which doses have been taken today)
// =============================================================================

export interface DoseLog {
  date: string; // YYYY-MM-DD
  takenIds: string[]; // entryId-time pairs like "entryId:HH:mm"
}

export function useDoseLog(uid: string | null) {
  const [log, setLog] = useState<DoseLog>({ date: todayStr(), takenIds: [] });

  useEffect(() => {
    if (!uid) return;
    const key = `mediguard:${uid}:doselog`;
    const today = todayStr();

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          setLog(parsed);
          return;
        }
      }
    } catch {}

    setLog({ date: today, takenIds: [] });
  }, [uid]);

  const setLogAndPersist = (next: DoseLog) => {
    setLog(next);
    if (uid && typeof window !== "undefined") {
      localStorage.setItem(`mediguard:${uid}:doselog`, JSON.stringify(next));
    }
  };

  return { log, setLog: setLogAndPersist };
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
