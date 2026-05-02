"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export function Hero() {
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (auroraRef.current) {
          auroraRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center px-4 pt-32 md:pt-40 pb-20 overflow-hidden">
      {/* Aurora background */}
      <div ref={auroraRef} className="aurora">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-12 gap-10 md:gap-6 items-center">
        {/* LEFT — copy */}
        <div className="md:col-span-7 space-y-7">
          <div
            className="inline-flex items-center gap-2 glass-button px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-teal-700 animate-fade-in"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Now with vision-based pill scanning
          </div>

          <h1
            className="font-display text-display-xl text-ink-950 text-balance animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            Your medications,
            <br />
            <span className="italic font-light text-teal-700">intelligently</span>{" "}
            cared for.
          </h1>

          <p
            className="text-lg md:text-xl text-ink-600 max-w-xl text-pretty leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.35s", opacity: 0 }}
          >
            Scan any pill. Build a smart schedule. Refill before you run out.
            MediGuard quietly handles the details so you can focus on living well.
          </p>

          <div
            className="flex flex-wrap items-center gap-3 pt-2 animate-fade-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            <Link href="/scan" className="btn-primary px-7 py-3.5 text-base group">
              Try the scanner
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/#how" className="glass-button px-6 py-3.5 text-[0.95rem] text-ink-800">
              See how it works
            </Link>
          </div>

          <div
            className="flex items-center gap-6 pt-4 animate-fade-in"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            <div className="flex -space-x-2">
              {["bg-coral-300", "bg-teal-400", "bg-coral-200", "bg-teal-300"].map((c, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${c} border-2 border-ink-50`}
                />
              ))}
            </div>
            <p className="text-sm text-ink-600">
              <span className="font-medium text-ink-900">12,400+</span>{" "}
              people trust MediGuard with their care
            </p>
          </div>
        </div>

        {/* RIGHT — floating phone preview */}
        <div className="md:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <PhoneMockup />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ink-500">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-ink-400 to-transparent animate-pulse-glow" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll</span>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] aspect-[9/19] animate-float">
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950 p-2 shadow-2xl">
        {/* Specular */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tl from-transparent via-white/5 to-white/15 pointer-events-none" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-teal-50 via-ink-50 to-coral-50">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink-950 rounded-full z-10" />

          {/* Status bar */}
          <div className="absolute top-3.5 inset-x-0 px-7 flex items-center justify-between text-[11px] font-mono text-ink-900 z-20">
            <span>9:41</span>
            <span>●●●●</span>
          </div>

          {/* Screen content */}
          <div className="absolute inset-0 pt-12 px-4 flex flex-col gap-3">
            {/* Greeting card */}
            <div className="glass-strong rounded-2xl p-3.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-ink-500">Good morning</p>
              <p className="font-display text-lg text-ink-900 mt-0.5">Sanan</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/15 flex items-center justify-center">
                  <span className="text-teal-700 text-xs font-bold">3</span>
                </div>
                <p className="text-xs text-ink-600">doses today</p>
              </div>
            </div>

            {/* Next dose card */}
            <div className="glass-tint rounded-2xl p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-wider text-coral-600">Next dose</p>
                <p className="text-[10px] font-mono text-ink-500">8:30 AM</p>
              </div>
              <p className="font-display text-base text-ink-900 mt-1">Atorvastatin</p>
              <p className="text-xs text-ink-600">10mg · with breakfast</p>
              <div className="mt-2 h-1 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full w-[68%] bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
              </div>
            </div>

            {/* Mini meds */}
            <div className="grid grid-cols-3 gap-2">
              {["#82cdc1", "#f7b1a2", "#52b3a6"].map((c, i) => (
                <div key={i} className="glass rounded-xl p-2 flex flex-col items-center gap-1">
                  <div className="w-7 h-3 rounded-full" style={{ background: c }} />
                  <p className="text-[8px] font-mono text-ink-500">M{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating callout */}
      <div className="absolute -left-6 top-1/4 glass-strong rounded-2xl p-3 shadow-glass-lg animate-float" style={{ animationDelay: "-2s" }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-teal-700">AI scan</p>
        <p className="text-xs font-medium text-ink-900">Identified in 2.3s</p>
      </div>
    </div>
  );
}
