import type { Session, User } from "@supabase/supabase-js";
import { cache } from "react";
import { getSupabaseServerClient } from "./supabase/server";

export type AuthState = {
  session: Session | null;
  user: User | null;
};

export const getServerAuth = cache(async (): Promise<AuthState> => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    session,
    user: session?.user ?? null,
  };
});
