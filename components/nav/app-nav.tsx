"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Camera, Pill, CalendarDays, MapPin, Home, ShieldPlus, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth-context";

const TABS = [
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/medications", label: "Meds", icon: Pill },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/pharmacy", label: "Pharmacy", icon: MapPin },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isDemo } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname?.startsWith(href);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [menuOpen]);

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "G";

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

          {/* User menu */}
          <div className="mt-auto relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/60 hover:bg-white/80 text-ink-700 transition-colors text-sm font-medium relative"
              aria-label="Account"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                initials
              )}
              {isDemo && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-coral-500 border-2 border-ink-50" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute bottom-0 left-full ml-3 glass-strong rounded-2xl p-2 min-w-[200px] shadow-glass-lg">
                <div className="px-3 py-2 border-b border-ink-200/60 mb-1">
                  <p className="text-sm font-medium text-ink-900 truncate">
                    {user?.displayName ?? user?.email ?? "Guest"}
                  </p>
                  {isDemo && (
                    <p className="text-[10px] font-mono uppercase tracking-widest text-coral-600 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Demo mode
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-ink-700 hover:bg-white/40 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {isDemo ? "Exit demo" : "Sign out"}
                </button>
              </div>
            )}
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

      {/* Mobile floating user button (top-right) */}
      <div className="lg:hidden fixed top-4 right-4 z-40" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="glass-strong w-11 h-11 rounded-full flex items-center justify-center text-ink-700 text-sm font-medium relative shadow-glass"
          aria-label="Account"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
          {isDemo && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-coral-500 border-2 border-ink-50" />
          )}
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 glass-strong rounded-2xl p-2 min-w-[200px] shadow-glass-lg">
            <div className="px-3 py-2 border-b border-ink-200/60 mb-1">
              <p className="text-sm font-medium text-ink-900 truncate">
                {user?.displayName ?? user?.email ?? "Guest"}
              </p>
              {isDemo && (
                <p className="text-[10px] font-mono uppercase tracking-widest text-coral-600 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  Demo mode
                </p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-ink-700 hover:bg-white/40 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              {isDemo ? "Exit demo" : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
