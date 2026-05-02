"use client";

import { Reveal } from "../ui/reveal";

const STEPS = [
  {
    num: "01",
    title: "Scan or add",
    body: "Snap a photo of any pill or paste in a name. We identify it and pre-fill the details — dosage, form, common uses.",
  },
  {
    num: "02",
    title: "Schedule with care",
    body: "Set when, how often, and with what. Sync to your calendar. Get a quiet reminder 15 minutes before every dose.",
  },
  {
    num: "03",
    title: "Stay stocked",
    body: "When supply runs low, a marketplace surfaces the best price across pharmacies. Refill in a single tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-4 py-28 md:py-36 bg-gradient-to-b from-transparent via-white/40 to-transparent">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-coral-600 mb-4">
            How it works
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-display-lg text-ink-950 max-w-2xl text-balance mb-20">
            Three steps, then it
            <span className="italic font-light text-ink-700"> just runs.</span>
          </h2>
        </Reveal>

        <ol className="space-y-10 md:space-y-2 relative">
          {/* Connecting line on desktop */}
          <span className="hidden md:block absolute left-[88px] top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-ink-200 to-transparent" />

          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={(i + 1) as 1 | 2 | 3}>
              <li className="grid md:grid-cols-12 gap-4 md:gap-8 items-start py-6 md:py-10">
                <div className="md:col-span-2 flex md:justify-end items-start">
                  <span className="font-mono text-2xl text-teal-600 tabular-nums relative md:bg-ink-50 md:px-3 md:rounded-full">
                    {step.num}
                  </span>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-display text-2xl md:text-3xl text-ink-950 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-ink-600 max-w-xl leading-relaxed text-pretty">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
