"use client";

import { FormEvent, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Field, Input, Select } from "../ui/form";
import { Button } from "../ui/button";
import { addMedication } from "../../lib/data";
import type { Medication } from "../../types";

interface AddMedicationModalProps {
  open: boolean;
  onClose: () => void;
  uid: string;
  isDemo: boolean;
  prefill?: Partial<Medication>;
}

export function AddMedicationModal({ open, onClose, uid, isDemo, prefill }: AddMedicationModalProps) {
  const [name, setName] = useState(prefill?.name ?? "");
  const [dosage, setDosage] = useState(prefill?.dosage ?? "");
  const [form, setForm] = useState<Medication["form"]>(prefill?.form ?? "tablet");
  const [color, setColor] = useState(prefill?.color ?? "white");
  const [pillsRemaining, setPillsRemaining] = useState(
    prefill?.pillsRemaining !== undefined ? String(prefill.pillsRemaining) : "30"
  );
  const [refillThreshold, setRefillThreshold] = useState(
    prefill?.refillThreshold !== undefined ? String(prefill.refillThreshold) : "10"
  );
  const [uses, setUses] = useState(prefill?.uses?.join(", ") ?? "");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setDosage("");
    setForm("tablet");
    setColor("white");
    setPillsRemaining("30");
    setRefillThreshold("10");
    setUses("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    setSubmitting(true);
    try {
      await addMedication(uid, isDemo, {
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        color,
        pillsRemaining: parseInt(pillsRemaining, 10) || 0,
        refillThreshold: parseInt(refillThreshold, 10) || 0,
        uses: uses.split(",").map((s) => s.trim()).filter(Boolean),
      });
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add medication. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add medication"
      description="Track what you take, when, and how much you have left."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Atorvastatin"
            required
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Dosage" required>
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 10 mg"
              required
            />
          </Field>
          <Field label="Form">
            <Select value={form} onChange={(e) => setForm(e.target.value as Medication["form"])}>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="liquid">Liquid</option>
              <option value="injection">Injection</option>
              <option value="other">Other</option>
            </Select>
          </Field>
        </div>

        <Field label="Color" hint="Used for visual identification in your list">
          <Select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="white">White</option>
            <option value="yellow">Yellow</option>
            <option value="amber">Amber</option>
            <option value="teal">Teal</option>
            <option value="coral">Coral</option>
          </Select>
        </Field>

        <Field label="Used for" hint="Comma-separated, e.g. Cholesterol, Heart health">
          <Input
            value={uses}
            onChange={(e) => setUses(e.target.value)}
            placeholder="Cholesterol management"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Pills remaining">
            <Input
              type="number"
              min="0"
              value={pillsRemaining}
              onChange={(e) => setPillsRemaining(e.target.value)}
            />
          </Field>
          <Field label="Refill at" hint="Alert when pills hit this number">
            <Input
              type="number"
              min="0"
              value={refillThreshold}
              onChange={(e) => setRefillThreshold(e.target.value)}
            />
          </Field>
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
            Add medication
          </Button>
        </div>
      </form>
    </Modal>
  );
}
