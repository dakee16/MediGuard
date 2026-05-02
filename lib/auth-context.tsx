"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth, firebaseEnabled } from "./firebase";

interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo: true;
}

export type AppUser = (User & { isDemo?: false }) | DemoUser;

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isDemo: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: DemoUser = {
  uid: "demo-user",
  email: "demo@mediguard.app",
  displayName: "Demo User",
  photoURL: null,
  isDemo: true,
};

const DEMO_KEY = "mediguard:demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate demo user from localStorage on mount
    if (typeof window !== "undefined" && localStorage.getItem(DEMO_KEY)) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    if (!firebaseEnabled || !auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser as AppUser | null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseEnabled || !auth) {
      throw new Error("Firebase not configured. Use demo mode instead.");
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!firebaseEnabled || !auth) {
      throw new Error("Firebase not configured. Use demo mode instead.");
    }
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    await signInWithPopup(auth, provider);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!firebaseEnabled || !auth) {
      throw new Error("Firebase not configured. Use demo mode instead.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!firebaseEnabled || !auth) {
      throw new Error("Firebase not configured. Use demo mode instead.");
    }
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInAsDemo = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_KEY, "1");
    }
    setUser(DEMO_USER);
  }, []);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DEMO_KEY);
    }
    if (firebaseEnabled && auth) {
      await fbSignOut(auth);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo: user?.isDemo === true,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
