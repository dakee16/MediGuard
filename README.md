# MediGuard

A personal AI assistant for everything you take. Scan, schedule, refill — all in one calm app.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom design system (teal + soft coral, Fraunces / Inter / JetBrains Mono)
- **Framer Motion** for subtle animations + a custom IntersectionObserver `<Reveal />` component
- **Firebase** Auth + Firestore for accounts and medication storage
- **Google Gemini Vision** (`gemini-1.5-flash`) for pill identification
- **Google Maps Places API** for pharmacy locator
- **iOS-style liquid glass** built with `backdrop-filter`, layered specular highlights, and pill geometry

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in keys (optional — see below)
npm run dev
```

Open <http://localhost:3000>.

## Demo mode

The app works without any API keys. Without keys:

- The Scan endpoint returns a realistic demo result for Atorvastatin
- The Pharmacy locator falls back to seeded State College, PA pharmacies
- Auth screens render but don't actually authenticate

Add real keys when you're ready to ship.

## Routes

| Route             | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `/`               | Marketing homepage — hero, features, how-it-works, testimonials   |
| `/scan`           | Camera/upload → Gemini Vision pill identification                 |
| `/medications`    | Medication list with low-supply alerts + inline refill marketplace |
| `/schedule`       | Daily timeline, calendar sync (Apple/Google), reminder toggle     |
| `/pharmacy`       | Two tabs: Nearby (map view) and Buy (online marketplace)           |
| `/login`          | Email + Google + Apple sign-in                                    |
| `/about`          | Story, values, privacy                                            |
| `/api/scan`       | POST — analyzes a base64 image with Gemini                        |
| `/api/pharmacy`   | GET — proxies Google Places nearby search                         |

## Design system

- **Display font:** Fraunces (with optical sizing + softness axis)
- **Body font:** Inter
- **Mono font:** JetBrains Mono — used for time stamps, dose numbers, eyebrows
- **Primary:** Teal `#349990`
- **Accent:** Soft coral `#e35d45`
- **Neutrals:** Warm "ink" palette `#191815` → `#faf9f7`

Liquid glass is implemented with three variants (`glass`, `glass-strong`, `glass-tint`) defined in `app/globals.css`, all using `backdrop-filter: blur() saturate()` plus a layered `::after` specular highlight for the iOS sheen.

## Project layout

```
app/
  page.tsx                  # Homepage
  layout.tsx                # Root with font loading
  globals.css               # Design tokens + liquid glass utilities
  (app)/                    # App route group — uses bottom-nav layout
    layout.tsx
    scan/page.tsx
    medications/page.tsx
    schedule/page.tsx
    pharmacy/page.tsx
  login/page.tsx
  about/page.tsx
  api/
    scan/route.ts
    pharmacy/route.ts
components/
  ui/                       # LiquidGlass, Button, Reveal
  nav/                      # MarketingNav, AppNav
  home/                     # Hero, Features, HowItWorks, Testimonials, Footer
lib/
  firebase.ts
  gemini.ts
  utils.ts
types/
  index.ts
```

## Deploy

Vercel:
```bash
vercel
```

Make sure to add the env vars from `.env.local` to the Vercel project.

## Roadmap

- [ ] Real Firestore wiring for medications and schedule (currently in-memory)
- [ ] Apple/Google calendar OAuth + ICS sync
- [ ] Web push notifications (15-min pre-dose)
- [ ] PWA manifest + offline support
- [ ] Caregiver sharing (read-only access for family)
- [ ] Drug-interaction checker across the full medication list

---

Built with care.
