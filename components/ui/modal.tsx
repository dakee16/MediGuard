"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass =
    size === "sm" ? "max-w-md" :
    size === "lg" ? "max-w-3xl" :
    "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-md" />

      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative glass-strong rounded-3xl w-full max-h-[88vh] overflow-y-auto shadow-glass-lg animate-fade-up",
          sizeClass
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/60 hover:bg-white/90 flex items-center justify-center text-ink-700 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 md:p-9">
          {title && (
            <div className="mb-6 pr-8">
              <h2 className="font-display text-2xl md:text-3xl text-ink-950">{title}</h2>
              {description && (
                <p className="text-sm text-ink-600 mt-1.5">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
