"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

type ActionState = { error?: string } | undefined;

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Gunakan email dan password Supabase Anda.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600">
            Daftar di sini
          </Link>
        </p>
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted-foreground underline"
          onClick={() => router.back()}
        >
          Kembali
        </button>
      </div>
    </main>
  );
}
