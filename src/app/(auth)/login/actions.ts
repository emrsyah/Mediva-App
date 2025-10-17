"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(_: unknown, formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const payload = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
