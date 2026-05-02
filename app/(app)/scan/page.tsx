"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, Sparkles, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { LiquidGlass } from "../../../components/ui/liquid-glass";
import { cn } from "../../../lib/utils";
import type { AnalyzedMedication } from "../../../types";

type Status = "idle" | "captured" | "analyzing" | "result" | "error";

export default function ScanPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzedMedication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStatus("idle");
    setImageSrc(null);
    setResult(null);
    setError(null);
  }

  async function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageSrc(dataUrl);
      setStatus("captured");

      // Auto-analyze
      setStatus("analyzing");
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();
        setResult(data);
        setStatus("result");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-2">
          AI vision · powered by Gemini
        </p>
        <h1 className="font-display text-display-md text-ink-950">Scan a medication</h1>
        <p className="text-ink-600 mt-2 max-w-xl">
          Take a photo or upload an image of any pill, bottle, or label. We&apos;ll identify it and surface what matters.
        </p>
      </header>

      {status === "idle" && (
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-tint rounded-3xl p-10 text-left hover:shadow-glass-lg transition-all group"
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft mb-6 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 text-white" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl text-ink-950 mb-2">Use camera</h3>
            <p className="text-sm text-ink-600">Snap a photo of the pill or bottle in front of you</p>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass rounded-3xl p-10 text-left hover:shadow-glass-lg transition-all group"
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-300 to-coral-500 shadow-soft mb-6 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-white" strokeWidth={2} />
            </span>
            <h3 className="font-display text-2xl text-ink-950 mb-2">Upload image</h3>
            <p className="text-sm text-ink-600">Choose a clear photo from your device</p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <LiquidGlass variant="default" className="md:col-span-2 p-6 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ink-900">Tips for best results</p>
              <p className="text-sm text-ink-600 mt-1">
                Good lighting · clear focus · framed against a contrasting background. Include any imprint or markings.
              </p>
            </div>
          </LiquidGlass>
        </div>
      )}

      {(status === "captured" || status === "analyzing" || status === "result" || status === "error") && imageSrc && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <LiquidGlass variant="strong" className="overflow-hidden p-2">
              <img src={imageSrc} alt="Captured medication" className="w-full rounded-2xl object-cover aspect-square" />
            </LiquidGlass>
            <button
              onClick={reset}
              className="glass-button absolute top-4 right-4 w-9 h-9 !p-0"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            {status === "analyzing" && (
              <LiquidGlass variant="tint" className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                <p className="font-display text-2xl text-ink-950 mt-6">Reading your medication…</p>
                <p className="text-sm text-ink-600 mt-2">Gemini is analyzing the image. This usually takes a couple seconds.</p>
              </LiquidGlass>
            )}

            {status === "error" && (
              <LiquidGlass variant="default" className="p-8">
                <AlertCircle className="w-7 h-7 text-coral-500" />
                <p className="font-display text-xl text-ink-950 mt-4">We couldn&apos;t analyze that image</p>
                <p className="text-sm text-ink-600 mt-2">{error}</p>
                <button onClick={reset} className="glass-button mt-6 px-5 py-2.5 text-sm">
                  Try another image
                </button>
              </LiquidGlass>
            )}

            {status === "result" && result && <ResultCard result={result} onReset={reset} />}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, onReset }: { result: AnalyzedMedication; onReset: () => void }) {
  const confidenceColor =
    result.confidence === "high" ? "text-teal-700 bg-teal-100" :
    result.confidence === "medium" ? "text-coral-700 bg-coral-100" :
    "text-ink-700 bg-ink-100";

  return (
    <div className="space-y-4">
      <LiquidGlass variant="strong" className="p-7">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-teal-700 mb-1">Identified</p>
            <h2 className="font-display text-3xl text-ink-950 leading-tight">{result.name}</h2>
            <p className="font-mono text-sm text-ink-600 mt-1">{result.dosage} · {result.form}</p>
          </div>
          <span className={cn("text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full", confidenceColor)}>
            {result.confidence ?? "unknown"} confidence
          </span>
        </div>

        <button className="btn-primary w-full py-3 mt-3">
          <Plus className="w-4 h-4" />
          Add to My Medications
        </button>
      </LiquidGlass>

      <Section title="Used to treat" items={result.uses} />
      <Section title="Common side effects" items={result.commonSideEffects} accent="coral" />
      <Section title="Watch for" items={result.seriousSideEffects} accent="warning" />
      <Section title="Avoid combining with" items={result.interactions} accent="warning" />

      {result.howItWorks && (
        <LiquidGlass variant="tint" className="p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-teal-700 mb-2">How it works</p>
          <p className="text-sm text-ink-800 leading-relaxed">{result.howItWorks}</p>
        </LiquidGlass>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <LiquidGlass className="p-6 border-coral-200/80">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-coral-600" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-coral-700">Warnings</p>
          </div>
          <ul className="space-y-1.5">
            {result.warnings.map((w, i) => (
              <li key={i} className="text-sm text-ink-800 flex gap-2">
                <span className="text-coral-500">•</span>
                {w}
              </li>
            ))}
          </ul>
        </LiquidGlass>
      )}

      {result.disclaimer && (
        <p className="text-xs text-ink-500 italic px-2">{result.disclaimer}</p>
      )}

      <button onClick={onReset} className="glass-button w-full py-3 text-sm">
        Scan another
      </button>
    </div>
  );
}

function Section({ title, items, accent = "default" }: { title: string; items?: string[]; accent?: "default" | "coral" | "warning" }) {
  if (!items || items.length === 0) return null;
  const dotColor = accent === "warning" ? "text-coral-500" : accent === "coral" ? "text-coral-400" : "text-teal-500";

  return (
    <LiquidGlass variant="default" className="p-6">
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-500 mb-3">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-ink-800 flex gap-2 items-start">
            <CheckCircle2 className={cn("w-3.5 h-3.5 mt-1 shrink-0", dotColor)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </LiquidGlass>
  );
}
