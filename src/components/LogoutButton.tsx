"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  return (
    <button
      type="button"
      className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
      onClick={async () => {
        setLoading(true);
        await signOut();
        router.replace("/login");
      }}
      disabled={loading}
    >
      {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}
