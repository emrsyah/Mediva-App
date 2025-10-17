"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthState } from "@/lib/auth";
import { supabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (payload: {
    email: string;
    password: string;
  }) => Promise<{ error?: string }>;
  signUp: (payload: {
    email: string;
    password: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function syncAuthCookie(event: string, session: Session | null) {
  await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event, session }),
  }).catch(() => {
    // Network errors can be ignored; cookies will refresh on next action.
  });
}

export function AuthProvider({
  initialState,
  children,
}: {
  initialState: AuthState;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(initialState.session);
  const [user, setUser] = useState<User | null>(initialState.user);
  const [loading, setLoading] = useState<boolean>(
    initialState.session === null,
  );

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    bootstrap();

    const { data: listener } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, nextSession) => {
        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);
        setLoading(false);
        await syncAuthCookie(event, nextSession);
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      signIn: async ({ email, password }) => {
        const { error } = await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        return {};
      },
      signUp: async ({ email, password }) => {
        const { error } = await supabaseBrowserClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) {
          return { error: error.message };
        }

        return {};
      },
      signOut: async () => {
        await supabaseBrowserClient.auth.signOut();
      },
    }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return ctx;
}
