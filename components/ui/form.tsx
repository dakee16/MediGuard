"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 flex items-center gap-1">
        {label}
        {required && <span className="text-coral-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="text-xs text-ink-500 mt-1.5">{hint}</p>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl bg-white/80 border border-ink-200 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400",
        "focus:border-teal-500 focus:bg-white outline-none transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl bg-white/80 border border-ink-200 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400",
        "focus:border-teal-500 focus:bg-white outline-none transition-colors resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-2xl bg-white/80 border border-ink-200 px-4 py-3 text-sm text-ink-900",
        "focus:border-teal-500 focus:bg-white outline-none transition-colors appearance-none",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236f6759%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:14px] bg-[position:right_1rem_center] bg-no-repeat pr-10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

interface ChipGroupProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
  multi?: boolean;
}

export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  multi = true,
}: ChipGroupProps<T>) {
  const toggle = (v: T) => {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange([v]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              active
                ? "bg-teal-600 text-white border-teal-600 shadow-soft"
                : "bg-white/60 text-ink-700 border-ink-200 hover:border-ink-300"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
