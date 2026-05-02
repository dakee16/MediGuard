"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldPlus } from "lucide-react";
import { Reveal } from "../ui/reveal";

export function FooterCTA() {
  return (
    <section className="relative px-4 py-28 md:py-36">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="relative glass-strong rounded-[2.5rem] p-10 md:p-20 overflow-hidden">
            {/* Decorative aurora inside the card */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute -top-32 -left-20 w-[400px] h-[400px] rounded-full bg-teal-300/40 blur-[100px]" />
              <div className="absolute -bottom-32 -right-20 w-[400px] h-[400px] rounded-full bg-coral-200/50 blur-[100px]" />
            </div>

            <div className="relative">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-6">
                Start free · No card required
              </p>
              <h2 className="font-display text-display-lg text-ink-950 text-balance max-w-2xl">
                Take the next dose with{" "}
                <span className="italic font-light text-teal-700">confidence.</span>
              </h2>
              <p className="text-lg text-ink-600 mt-6 max-w-lg leading-relaxed">
                Join thousands who've replaced sticky notes and pill organizers with something that actually works.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-10">
                <Link href="/scan" className="btn-primary px-7 py-3.5 text-base">
                  Get started free
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="glass-button px-6 py-3.5 text-[0.95rem] text-ink-800">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-4 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto pt-12 border-t border-ink-200/60">
        <div className="grid md:grid-cols-4 gap-10 md:gap-6">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft">
                <ShieldPlus className="w-4.5 h-4.5 text-white" strokeWidth={2.4} />
              </span>
              <span className="font-display text-xl font-medium text-ink-900 tracking-tight">
                MediGuard
              </span>
            </Link>
            <p className="text-sm text-ink-600 mt-4 max-w-sm leading-relaxed">
              A personal AI assistant for everything you take. Built with care, designed for the long haul.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              ["Scan", "/scan"],
              ["Medications", "/medications"],
              ["Schedule", "/schedule"],
              ["Pharmacy", "/pharmacy"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["About", "/about"],
              ["Privacy", "/about#privacy"],
              ["Terms", "/about#terms"],
              ["Contact", "mailto:hello@mediguard.app"],
            ]}
          />
        </div>

        <div className="mt-16 pt-6 border-t border-ink-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-ink-500">
          <p>© 2026 MediGuard. Educational tool — not a substitute for medical advice.</p>
          <p className="font-mono">v2.0 · Made with care</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-500 mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sm text-ink-700 hover:text-ink-900 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
