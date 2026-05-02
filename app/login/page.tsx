"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldPlus, Apple, Mail, ArrowRight } from "lucide-react";
import { LiquidGlass } from "../../components/ui/liquid-glass";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"choose" | "email">("choose");

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-ink-50 overflow-hidden">
      {/* Atmosphere */}
      <div className="aurora">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <span className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft">
            <ShieldPlus className="w-5 h-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-medium text-ink-900 tracking-tight">
            MediGuard
          </span>
        </Link>

        <h1 className="font-display text-display-md text-ink-950 mb-3 text-balance">
          Welcome back.
        </h1>
        <p className="text-ink-600 mb-10">
          Sign in to pick up where you left off.
        </p>

        <LiquidGlass variant="strong" className="p-7 space-y-3">
          {step === "choose" && (
            <>
              <button className="glass-button w-full py-3.5 text-sm justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27a10.5 10.5 0 0 0-.18-2.07h-10.1v3.91h5.78a4.95 4.95 0 0 1-2.13 3.25v2.7h3.45c2.02-1.86 3.18-4.6 3.18-7.79z"/><path fill="#34A853" d="M12.22 22.5c2.88 0 5.3-.95 7.06-2.59l-3.45-2.7a6.5 6.5 0 0 1-9.7-3.41h-3.55v2.78a10.5 10.5 0 0 0 9.64 5.92z"/><path fill="#FBBC05" d="M6.13 13.8a6.45 6.45 0 0 1 0-4.1V6.92H2.58a10.5 10.5 0 0 0 0 10.66l3.55-2.78z"/><path fill="#EA4335" d="M12.22 5.42a5.7 5.7 0 0 1 4.03 1.58l3.06-3.06A10.1 10.1 0 0 0 12.22 1.5a10.5 10.5 0 0 0-9.64 5.92l3.55 2.78a6.31 6.31 0 0 1 6.09-4.78z"/></svg>
                Continue with Google
              </button>
              <button className="glass-button w-full py-3.5 text-sm justify-center">
                <Apple className="w-4 h-4 fill-current" />
                Continue with Apple
              </button>

              <div className="flex items-center gap-3 py-2">
                <span className="flex-1 h-px bg-ink-200" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500">or</span>
                <span className="flex-1 h-px bg-ink-200" />
              </div>

              <button onClick={() => setStep("email")} className="glass-button w-full py-3.5 text-sm justify-center">
                <Mail className="w-4 h-4" />
                Continue with email
              </button>
            </>
          )}

          {step === "email" && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                /* TODO: signInWithEmailAndPassword(auth, email, password) */
              }}
            >
              <label className="block">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-2xl bg-white/80 border border-ink-200 px-4 py-3 text-sm focus:border-teal-500 outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500">Password</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-2xl bg-white/80 border border-ink-200 px-4 py-3 text-sm focus:border-teal-500 outline-none transition-colors"
                />
              </label>
              <button type="submit" className="btn-primary w-full py-3.5 text-sm justify-center mt-2">
                Sign in
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setStep("choose")} className="text-xs text-ink-500 hover:text-ink-900 transition-colors w-full text-center mt-2">
                ← Other ways to sign in
              </button>
            </form>
          )}
        </LiquidGlass>

        <p className="text-center text-sm text-ink-600 mt-8">
          New to MediGuard?{" "}
          <Link href="/scan" className="text-teal-700 hover:text-teal-800 font-medium">
            Get started free
          </Link>
        </p>
      </div>
    </main>
  );
}
