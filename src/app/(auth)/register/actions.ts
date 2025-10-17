"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(_: unknown, formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const payload = registerSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const { data, error } = await supabase.auth.signUp(payload);

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword(payload);

    if (signInError) {
      return { error: signInError.message };
    }

    if (!signInData.session) {
      return { error: "Tidak dapat membuat sesi otomatis." };
    }
  }

  redirect("/");
}
