import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const cookieStore = await cookies();
  const response = NextResponse.json({ status: "ok" });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.delete({ name, ...options });
      },
    },
  });

  if (payload.event === "SIGNED_OUT") {
    await supabase.auth.signOut();
    return response;
  }

  if (payload.session) {
    await supabase.auth.setSession(payload.session);
  }

  return response;
}
