"use client";

import { Camera, Pill, CalendarDays, MapPin, ShoppingBag } from "lucide-react";
import { Reveal } from "../ui/reveal";

const FEATURES = [
  {
    icon: Camera,
    label: "Scan",
    title: "Point. Identify. Know.",
    body: "AI vision recognizes any pill in seconds. Get uses, side effects, interactions, and warnings — all in plain language.",
    accent: "from-teal-400 to-teal-600",
  },
  {
    icon: Pill,
    label: "Your Medication",
    title: "Everything you take, in one place.",
    body: "Track doses, refill thresholds, and supply. When you're running low, a quiet store appears with the best prices.",
    accent: "from-coral-300 to-coral-500",
  },
  {
    icon: CalendarDays,
    label: "Schedule",
    title: "Reminders that respect your day.",
    body: "Build custom dosing schedules. Sync to Apple or Google Calendar. Get a gentle nudge 15 minutes before every dose.",
    accent: "from-teal-300 to-teal-500",
  },
  {
    icon: MapPin,
    label: "Pharmacy",
    title: "The closest help, the best price.",
    body: "Find pharmacies on a live map. Compare prices across CVS, Walgreens, Amazon, and Costco — refill in a tap.",
    accent: "from-coral-200 to-coral-400",
  },
  {
    icon: ShoppingBag,
    label: "Marketplace",
    title: "A calmer way to refill.",
    body: "Search any medication and see real-time inventory and pricing across major vendors. Order direct, no calls.",
    accent: "from-teal-400 to-coral-300",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow + heading */}
        <Reveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-4">
            What MediGuard does
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-display-lg text-ink-950 max-w-3xl text-balance">
            Five quiet tools.
            <br />
            <span className="italic font-light text-ink-700">One peaceful routine.</span>
          </h2>
        </Reveal>

        {/* Feature grid — editorial layout, asymmetric */}
        <div className="mt-20 grid md:grid-cols-12 gap-6">
          {/* Hero feature — large */}
          <Reveal delay={1} className="md:col-span-7">
            <FeatureCard {...FEATURES[0]} large />
          </Reveal>
          <Reveal delay={2} className="md:col-span-5">
            <FeatureCard {...FEATURES[1]} />
          </Reveal>
          <Reveal delay={1} className="md:col-span-4">
            <FeatureCard {...FEATURES[2]} />
          </Reveal>
          <Reveal delay={2} className="md:col-span-4">
            <FeatureCard {...FEATURES[3]} />
          </Reveal>
          <Reveal delay={3} className="md:col-span-4">
            <FeatureCard {...FEATURES[4]} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: typeof Camera;
  label: string;
  title: string;
  body: string;
  accent: string;
  large?: boolean;
}

function FeatureCard({ icon: Icon, label, title, body, accent, large }: FeatureCardProps) {
  return (
    <div
      className={`glass-tint rounded-3xl p-7 md:p-9 h-full group hover:shadow-glass-lg transition-shadow duration-500 ${
        large ? "min-h-[280px]" : "min-h-[260px]"
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <span
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} shadow-soft`}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-transparent via-white/30 to-white/40 pointer-events-none" />
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-500">
          {label}
        </span>
      </div>

      <h3
        className={`font-display text-ink-950 text-balance leading-tight ${
          large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-ink-600 mt-3 leading-relaxed text-pretty ${
          large ? "text-base" : "text-sm"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
