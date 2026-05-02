"use client";

import { FormEvent, useState } from "react";
import { Plus, Loader2, X as XIcon } from "lucide-react";
import { Modal } from "../ui/modal";
import { Field, Input, Select, ChipGroup } from "../ui/form";
import { Button } from "../ui/button";
import { addScheduleEntry } from "../../lib/data";
import type { Medication } from "../../types";

interface AddDoseModalProps {
  open: boolean;
  onClose: () => void;
  uid: string;
  isDemo: boolean;
  medications: Medication[];
}

const DAY_OPTIONS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function AddDoseModal({ open, onClose, uid, isDemo, medications }: AddDoseModalProps) {
  const [medicationId, setMedicationId] = useState(medications[0]?.id ?? "");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [withFood, setWithFood] = useState(false);
  const [remindersOn, setRemindersOn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedMed = medications.find((m) => m.id === medicationId);

  function addTime() {
    setTimes([...times, "12:00"]);
  }

  function removeTime(idx: number) {
    setTimes(times.filter((_, i) => i !== idx));
  }

  function setTime(idx: number, value: string) {
    setTimes(times.map((t, i) => (i === idx ? value : t)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedMed || times.length === 0 || daysOfWeek.length === 0) return;

    setSubmitting(true);
    try {
      await addScheduleEntry(uid, isDemo, {
        medicationId: selectedMed.id,
        medicationName: selectedMed.name,
        dosage: selectedMed.dosage,
        times,
        daysOfWeek,
        withFood,
        startsOn: new Date().toISOString(),
        remindersOn,
      });
      // Reset
      setTimes(["08:00"]);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
      setWithFood(false);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add dose. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (medications.length === 0) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Add a medication first"
        description="You need at least one medication before you can schedule doses."
      >
        <div className="flex justify-end pt-4">
          <Button variant="primary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule a dose"
      description="Set when you take it, and we'll remind you 15 minutes before."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Medication" required>
          <Select
            value={medicationId}
            onChange={(e) => setMedicationId(e.target.value)}
            required
          >
            {medications.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.dosage}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Times" hint="Add as many as needed">
          <div className="space-y-2">
            {times.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(i, e.target.value)}
                  className="flex-1"
                  required
                />
                {times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTime(i)}
                    className="w-10 h-10 rounded-full bg-white/60 hover:bg-coral-100 flex items-center justify-center text-ink-500 hover:text-coral-700 transition-colors"
                    aria-label="Remove time"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTime}
              className="text-sm text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add another time
            </button>
          </div>
        </Field>

        <Field label="Days of week" required>
          <ChipGroup
            options={DAY_OPTIONS}
            value={daysOfWeek}
            onChange={setDaysOfWeek}
            multi
          />
        </Field>

        <div className="space-y-3 pt-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={withFood}
              onChange={(e) => setWithFood(e.target.checked)}
              className="w-4 h-4 accent-teal-600"
            />
            <span className="text-sm text-ink-800">Take with food</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remindersOn}
              onChange={(e) => setRemindersOn(e.target.checked)}
              className="w-4 h-4 accent-teal-600"
            />
            <span className="text-sm text-ink-800">Remind me 15 minutes before each dose</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Schedule dose
          </Button>
        </div>
      </form>
    </Modal>
  );
}
