"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Pill, CalendarDays, MapPin, Home, ShieldPlus } from "lucide-react";
import { cn } from "../../lib/utils";

const TABS = [
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/medications", label: "Meds", icon: Pill },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/pharmacy", label: "Pharmacy", icon: MapPin },
];

export function AppNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* DESKTOP — left sidebar */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 z-40 flex-col items-center w-20">
        <div className="glass-strong rounded-3xl flex flex-col items-center w-full h-full py-6 gap-2">
          <Link
            href="/"
            className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft mb-4"
            aria-label="MediGuard home"
          >
            <ShieldPlus className="w-5 h-5 text-white" strokeWidth={2.4} />
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-transparent via-white/30 to-white/40 pointer-events-none" />
          </Link>

          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl transition-all",
              pathname === "/"
                ? "bg-teal-500/10 text-teal-700"
                : "text-ink-500 hover:text-ink-900 hover:bg-white/40"
            )}
          >
            <Home className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium tracking-wide">Home</span>
          </Link>

          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl transition-all",
                  active
                    ? "bg-teal-500/10 text-teal-700"
                    : "text-ink-500 hover:text-ink-900 hover:bg-white/40"
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </Link>
            );
          })}

          <div className="mt-auto">
            <Link
              href="/login"
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/60 hover:bg-white/80 text-ink-700 transition-colors text-sm font-medium"
              aria-label="Account"
            >
              SG
            </Link>
          </div>
        </div>
      </aside>

      {/* MOBILE — bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
        <div className="glass-strong rounded-full px-2 py-2 mx-auto max-w-md flex items-center justify-around pointer-events-auto shadow-glass-lg">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full transition-all min-w-[56px]",
              pathname === "/" ? "text-teal-700" : "text-ink-500"
            )}
          >
            <Home className="w-5 h-5" strokeWidth={pathname === "/" ? 2.4 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full transition-all min-w-[56px] relative",
                  active ? "text-teal-700" : "text-ink-500"
                )}
              >
                {active && (
                  <span className="absolute inset-0 bg-teal-500/12 rounded-full" />
                )}
                <Icon className="w-5 h-5 relative" strokeWidth={active ? 2.4 : 2} />
                <span className="text-[10px] font-medium relative">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
