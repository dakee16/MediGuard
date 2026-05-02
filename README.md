# MediGuard

A personal AI assistant for everything you take — built with Next.js 15, Firebase, and Gemini.

**Live:** https://mediguard-rust.vercel.app
**Repo:** https://github.com/dakee16/MediGuard

## What's wired

| Feature | Backend |
|---------|---------|
| **Auth** — Google, Apple, Email/Password | Firebase Authentication |
| **Medications + Schedule** | Cloud Firestore (per-user docs at `/users/{uid}/medications` and `/users/{uid}/schedule`) |
| **Demo mode** — try without signing up | localStorage fallback, full feature parity |
| **Scan a pill** | Google Gemini Vision via `/api/scan` |
| **Real pharmacy map** | Google Maps JS SDK + Places Nearby Search via `/api/pharmacy` |
| **Calendar export** | `.ics` download (Apple Calendar) + Google Calendar import |
| **Reminders** | Browser Notifications API, fires 15 min before each dose |
| **Add / edit / delete meds & doses** | Real CRUD with realtime Firestore listeners |

## Setup

### 1. Install
```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Firebase (required for real accounts; skip to use demo mode)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Gemini (required for the scanner)
GEMINI_API_KEY=

# Google Maps (required for real pharmacy map)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_KEY=
```

### 3. Firebase console setup

In your Firebase project:

1. **Authentication → Sign-in method**: enable Google, Apple, and Email/Password
2. **Firestore → Rules**: paste this and publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 4. Google Cloud setup

In Google Cloud Console for your Maps key:

- Enable **Maps JavaScript API**
- Enable **Places API**
- (Optional) Restrict the key to your Vercel domain

### 5. Run

```bash
npm run dev
# or
npm run build && npm start
```

## Demo mode

If `NEXT_PUBLIC_FIREBASE_*` vars are missing, the login page shows a **Try demo mode** option. All data persists in `localStorage` under the key `mediguard:demo-user:*`. The app is fully functional — only difference is it doesn't sync across devices.

## Architecture

- **App Router** with route groups: `(app)` for authed routes, `(marketing)` for public
- `AuthGate` wraps every authed page and redirects to `/login` if no user
- `lib/data.ts` is the single source of truth for medications/schedule — auto-routes to Firestore or localStorage based on auth state
- `lib/firebase.ts` initializes safely; `firebaseEnabled` flag controls behavior
- All UI primitives in `components/ui/` use the same liquid-glass design system

## Stack

- Next.js 15.5.7 (App Router, Server Components where useful)
- TypeScript
- Tailwind CSS 3.4 with custom design tokens (Fraunces / Inter / JetBrains Mono, teal + soft coral palette)
- Firebase 11 (Auth + Firestore)
- `@react-google-maps/api` 2.20
- `@google/generative-ai` for Gemini Vision
- Framer Motion for transitions
- Lucide React for icons

## Built by

[Sanan Goel](https://github.com/sanan-goel1010), [Daksh](https://github.com/dakee16), [Kabir Bathija](https://github.com/kabirbathija)
