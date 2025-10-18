"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, Camera, Loader2, Pill, Send, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { AlternativeCardList } from "@/components/AlternativeCardList";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { DrugRiskCard } from "@/components/DrugRiskCard";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Orb } from "react-ai-orb";

// Remove auth-related import and logic

interface DrugRiskOutput {
  isFound: boolean;
  drugName: string;
  category: "A" | "B" | "C" | "D";
  recommendation: string;
  finalRecommendation:
  | "Aman untuk dikonsumsi"
  | "Aman untuk dikonsumsi dengan catatan"
  | "Tidak aman untuk dikonsumsi";
  alternatives: { name: string; description: string }[];
}

export default function MedivaConsult() {
  // Remove all hooks and variables related to auth/session/profile
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      inputRef.current?.focus();
      return;
    }
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <main
      className={cn(
        "relative mx-auto flex min-h-screen max-w-md flex-col px-6 pt-6 pb-40 gap-6",
        "bg-gradient-to-b from-white via-[#d5e4ff] to-[#4169e1]/70",
      )}
    >
      {/* Top bar */}
      <header className="flex items-center justify-center relative mb-2">
        <Link
          href="/"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground bg-white/70 backdrop-blur"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold">Mediva Consult AI</h1>
          <p className="text-xs text-muted-foreground">
            Dapatkan jawaban aman dan cepat
          </p>
        </div>
        {/* Remove LogOut button on top-right */}
      </header>

      {/* Messages list */}
      <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none max-h-[calc(100vh-200px)]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-xl px-4 py-2 text-sm whitespace-pre-wrap shadow-sm w-fit max-w-[75%]",
              m.role === "user"
                ? "self-end bg-violet-600 text-white"
                : "self-start bg-white backdrop-blur",
            )}
          >
            {m.parts.map((p) =>
              p.type === "text" ? (
                <MemoizedMarkdown
                  key={`${m.id}-text`}
                  id={m.id}
                  content={p.text}
                />
              ) : p.type === "tool-displayDrugRisk" ? (
                (() => {
                  const risk = p.output as DrugRiskOutput;
                  switch (p.state) {
                    case "input-available":
                      return <Shimmer key={`${m.id}-tool-displayDrugRisk-${new Date().getTime()}`}>🔍 Mencari informasi obat...</Shimmer>;
                    case "output-available":
                      return (
                        <div
                          key={`${m.id}-tool-${risk.drugName}`}
                          className="flex flex-col gap-2"
                        >
                          {risk.isFound ? (
                            <>
                              <DrugRiskCard
                                finalRecommendation={risk.finalRecommendation}
                                drugName={risk.drugName}
                                category={risk.category}
                                recommendation={risk.recommendation}
                                onShowAlternatives={
                                  risk.alternatives.length > 0
                                    ? () =>
                                      sendMessage({
                                        text: `Beritahu detail penggunaan ${risk.alternatives[0].name}`,
                                      })
                                    : undefined
                                }
                              />
                              <div className="mb-2"></div>
                            </>
                          ) : (
                            <>
                              <span className="border border-amber-400 mb-2 bg-amber-50 p-2 rounded-md">
                                Obat tidak ditemukan
                              </span>
                              {risk.alternatives.length > 0 && (
                                <AlternativeCardList
                                  alternatives={risk.alternatives}
                                  onSelect={(alt) =>
                                    sendMessage({
                                      text: `Beritahu detail penggunaan ${alt.name}`,
                                    })
                                  }
                                />
                              )}
                            </>
                          )}
                        </div>
                      );
                    case "output-error":
                      return (
                        <span className="text-sm text-red-600">
                          Terjadi kesalahan: {p.errorText}
                        </span>
                      );
                    default:
                      return null;
                  }
                })()
              ) : p.type === "tool-confirmDrugConsumption" ? (
                (() => {
                  const confirm = p.output as {
                    message: string;
                    drugName: string;
                    confirmationRequested: boolean;
                  };

                  switch (p.state) {
                    case "input-available":
                      return <Shimmer key={`${m.id}-tool-confirmDrugConsumption-${new Date().getTime()}`}>Menyiapkan pertanyaan...</Shimmer>;
                    case "output-available":
                      return (
                        <div className="flex flex-col gap-2">
                          <span>{confirm.message}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                sendMessage({ text: "yes" })
                              }
                            >
                              Ya
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                sendMessage({ text: "no" })
                              }
                            >
                              Tidak
                            </Button>
                          </div>
                        </div>
                      );
                    case "output-error":
                      return (
                        <span className="text-sm text-red-600">
                          Terjadi kesalahan: {p.errorText}
                        </span>
                      );
                    default:
                      return null;
                  }
                })()
              ) : p.type === "tool-writeMemory" ? (
                (() => {
                  const mem = p.output as { stored: boolean; content: string };
                  switch (p.state) {
                    case "input-available":
                      return (
                        <Shimmer key={`${m.id}-tool-writeMemory-${Date.now()}`}>
                          ✍️ Menambahkan Memori...
                        </Shimmer>
                      );
                    case "output-available":
                      return (
                        <span className="text-sm mb-2 text-green-600">
                          ✅ Memori ditambahkan: "{mem.content}"
                        </span>
                      );
                    case "output-error":
                      return (
                        <span className="text-sm text-red-600">
                          Gagal menambahkan memori: {p.errorText}
                        </span>
                      );
                    default:
                      return null;
                  }
                })()
              ) : null,
            )}
          </div>
        ))}
        {status === "submitted" && <Shimmer>Alva sedang berpikir...</Shimmer>}
      </div>

      {/* Greeting & question */}
      {messages.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">Halo Bunda!</p>
          <h2 className="text-3xl font-semibold tracking-wide text-violet-600">
            Apa yang bisa Alva
            <br /> bantu hari ini?
          </h2>
        </div>
      )}

      {/* Orb illustration */}
      {messages.length === 0 && (
        <div className="mx-auto">
          <Orb />
        </div>
      )}

      {/* Action cards */}
      {messages.length === 0 && (
        <div className="grid grid-cols-2 gap-4">
          <ConsultCard
            href="/consult/drug-safety"
            icon={<Pill size={28} />}
            title="Cek Keamanan Obat bagi Ibu hamil"
          />
          <ConsultCard
            href="/consult/symptom-check"
            icon={<Stethoscope size={28} />}
            title="Tanya Gejala Penyakit Ibu Hamil"
          />
        </div>
      )}

      {/* Chat input */}
      <form
        onSubmit={handleSubmit}
        className="fixed inset-x-0 bottom-5 mx-auto w-full  max-w-md px-6"
      >
        <div className="relative flex items-center gap-1">
          <div className="border-none flex items-center rounded-full w-full bg-white pl-2 pr-4 py-2 focus-visible:ring-0">
            <Button type="button" size="icon" className="h-8  w-8 rounded-full bg-white text-gray-500 shadow-none hover:bg-gray-100 focus-visible:ring-0">
              <Camera size={22} />
            </Button>
            <Input
              placeholder="Mulai konsultasi dengan Alva di sini"
              className="w-full border-none shadow-none focus-visible:ring-0"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={status !== "ready"}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="right-2 h-12 w-12 rounded-full bg-blue-600 text-white shadow-md hover:bg-violet-700 disabled:opacity-50"
            disabled={status !== "ready" && status !== "streaming"}
          >
            {status === "streaming" ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}

interface ConsultCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

function ConsultCard({ href, icon, title }: ConsultCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full cursor-pointer transition-transform hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center gap-3 !px-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white">
            {icon}
          </span>
        </CardHeader>
        <CardContent className="!px-4 pb-4">
          <CardTitle className="text-base font-medium leading-snug">
            {title}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
