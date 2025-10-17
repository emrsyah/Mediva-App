import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pill } from "lucide-react";

interface DrugRiskCardProps {
  drugName: string;
  category: "A" | "B" | "C" | "D";
  recommendation: string;
  finalRecommendation:
    | "Aman untuk dikonsumsi"
    | "Aman untuk dikonsumsi dengan catatan"
    | "Tidak aman untuk dikonsumsi";
  onShowAlternatives?: () => void;
}

export function DrugRiskCard({
  drugName,
  category,
  recommendation,
  finalRecommendation,
  onShowAlternatives,
}: DrugRiskCardProps) {
  const colorMap: Record<DrugRiskCardProps["category"], string> = {
    A: "bg-emerald-100 text-emerald-700",
    B: "bg-yellow-100 text-yellow-700",
    C: "bg-orange-100 text-orange-700",
    D: "bg-rose-100 text-rose-700",
  };

  const recommendationColor =
    finalRecommendation === "Aman untuk dikonsumsi"
      ? "bg-emerald-100 text-emerald-700"
      : finalRecommendation === "Aman untuk dikonsumsi dengan catatan"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-rose-100 text-rose-700";

  return (
    <Card className="shadow-none border-none py-3">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-lg font-semibold">
          Hasil Pengecekan Obat Anda
        </CardTitle>
        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#C49AE4] to-[#4157E2]">
          <Pill size={20} className="text-white" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm p-0">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Nama Obat</span>
          <span className="font-medium">{drugName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Kategori</span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              colorMap[category],
            )}
          >
            {category}
          </span>
        </div>
        <div>
          <p className="mb-1 text-muted-foreground">Rekomendasi Akhir</p>
          <div
            className={cn(
              "rounded-md p-3 text-center text-sm font-semibold",
              recommendationColor,
            )}
          >
            {finalRecommendation}
          </div>
        </div>
        <div>
          <p className="mb-1 text-muted-foreground">Catatan</p>
          <p className="text-sm leading-relaxed">{recommendation || "Tidak ada data terkait lebih lanjut."}</p>
        </div>
        {onShowAlternatives ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onShowAlternatives}
          >
            Lihat Alternatif Obat Aman
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
