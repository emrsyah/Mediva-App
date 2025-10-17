"use client";

import { Baby, Heart, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="font-sans max-w-md mx-auto min-h-screen px-4 pt-10 pb-24 flex flex-col gap-6">
      {/* Greeting */}
      <header className="flex items-center gap-3">
        <Image
          src="/window.svg"
          alt="Avatar"
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-lg font-semibold leading-tight">
            Selamat Pagi {user?.email ?? "Bunda"}!{" "}
            <span className="inline-block">👋🏻</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Bagaimana Kabar Hari Ini?
          </p>
        </div>
      </header>

      {/* Pregnancy Status Card */}
      <section className="rounded-xl border shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Status Kehamilan</h2>
          <Baby className="text-violet-600" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usia Kehamilan</span>
            <span className="font-medium">
              {/* Future: calculate from profile */}
              Belum diisi
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-violet-600" style={{ width: "60%" }} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trimester</span>
            <span className="font-medium">-</span>
          </div>
        </div>
      </section>

      {/* Consult CTA */}
      <section className="rounded-xl bg-gradient-to-br from-violet-400/40 to-violet-600/30 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-violet-700" />
          <h2 className="font-medium">Mediva Consult AI</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dapatkan saran medis terkait obat dan gejala penyakit berdasarkan
          kondisi kehamilan Anda
        </p>
        <Link
          href={user ? "/consult" : "/login"}
          className="mx-auto w-full max-w-xs rounded-full bg-violet-600 py-2 text-center text-sm font-medium text-white shadow"
        >
          {user ? "Mulai Sesi Konsultasi" : "Masuk untuk Konsultasi"}
        </Link>
      </section>

      {/* Medicine Recommendations */}
      <section className="rounded-xl border shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Rekomendasi Obat</h2>
          <Heart className="text-violet-600" />
        </div>
        <p className="text-sm text-muted-foreground">
          Obat yang aman sesuai kondisi kehamilan Anda
        </p>
        <ul className="flex flex-col divide-y">
          {[
            {
              name: "Paracetamol",
              desc: "Pereda Nyeri dan Demam",
              img: "/vercel.svg",
            },
            {
              name: "Phenylephrine",
              desc: "Obat Hidung Tersumbat",
              img: "/vercel.svg",
            },
          ].map((m) => (
            <li key={m.name} className="py-3 flex items-center gap-3">
              <Image
                src={m.img}
                alt={m.name}
                width={40}
                height={40}
                className="rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <span className="text-muted-foreground">&gt;</span>
            </li>
          ))}
        </ul>
      </section>

      <BottomNav active="home" />
    </main>
  );
}
