"use client";

import { Reveal } from "../ui/reveal";
import { Quote } from "lucide-react";

const REVIEWS = [
  {
    quote:
      "I was juggling six prescriptions for my mom across three pharmacies. MediGuard pulled it all together in one afternoon. The reminders are the gentlest I've used.",
    name: "Priya R.",
    role: "Caregiver, Boston",
    accent: "teal",
  },
  {
    quote:
      "The pill scanner caught a mix-up at the pharmacy that I would have missed. That alone is worth it.",
    name: "Marcus W.",
    role: "Type 2 diabetes, Chicago",
    accent: "coral",
  },
  {
    quote:
      "Calendar sync changed everything. My morning dose just appears on my watch with everything else. No more separate app to remember.",
    name: "Lena K.",
    role: "Hashimoto's, Berlin",
    accent: "teal",
  },
  {
    quote:
      "I run low on my asthma inhaler twice a year. Now I get the cheapest option emailed to me before I even notice. It feels like having a quiet PA.",
    name: "Daniel A.",
    role: "Asthma, Austin",
    accent: "coral",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 py-28 md:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-4">
            Stories from the people who use it
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-display-lg text-ink-950 max-w-3xl text-balance mb-16">
            Quietly indispensable.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <figure
                className={`glass-tint rounded-3xl p-8 md:p-10 h-full flex flex-col justify-between ${
                  i % 2 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <Quote
                  className={`w-7 h-7 ${
                    review.accent === "teal" ? "text-teal-500/60" : "text-coral-400/70"
                  }`}
                  strokeWidth={1.4}
                />
                <blockquote className="font-display text-xl md:text-2xl text-ink-900 leading-snug text-pretty my-6">
                  {review.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-ink-200/50">
                  <span
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                      review.accent === "teal"
                        ? "from-teal-300 to-teal-500"
                        : "from-coral-300 to-coral-500"
                    } flex items-center justify-center text-white font-medium text-sm`}
                  >
                    {review.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{review.name}</p>
                    <p className="text-xs text-ink-500">{review.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Stats strip */}
        <Reveal delay={2}>
          <div className="mt-24 glass-strong rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["12,400+", "Active members"],
              ["98.7%", "Adherence rate"],
              ["3.2M+", "Doses tracked"],
              ["4.9★", "App store"],
            ].map(([stat, label]) => (
              <div key={stat} className="text-center md:text-left">
                <p className="font-display text-3xl md:text-4xl text-ink-950 tracking-tight">{stat}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-ink-500 mt-2">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
