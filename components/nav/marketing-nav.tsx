"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { ShieldPlus } from "lucide-react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#testimonials", label: "Stories" },
  { href: "/about", label: "About" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide marketing nav on app routes
  if (pathname?.startsWith("/scan") || pathname?.startsWith("/medications") || pathname?.startsWith("/schedule") || pathname?.startsWith("/pharmacy")) {
    return null;
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto max-w-6xl flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500",
          scrolled
            ? "glass-strong shadow-glass"
            : "bg-transparent border border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pl-2 group">
          <span className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft">
            <ShieldPlus className="w-4.5 h-4.5 text-white" strokeWidth={2.4} />
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-transparent via-white/30 to-white/40 pointer-events-none" />
          </span>
          <span className="font-display text-xl font-medium text-ink-900 tracking-tight">
            MediGuard
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 text-sm text-ink-700 hover:text-ink-900 transition-colors rounded-full hover:bg-white/40"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm text-ink-700 hover:text-ink-900 transition-colors rounded-full hover:bg-white/40"
          >
            Log in
          </Link>
          <Link
            href="/scan"
            className="btn-primary px-5 py-2 text-sm"
          >
            Open app
          </Link>
        </div>
      </nav>
    </header>
  );
}
