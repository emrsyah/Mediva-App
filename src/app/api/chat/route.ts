import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { tools } from "@/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const responseStream = streamText({
    model: openai("gpt-4o"),
    system:
      `Anda adalah asisten medis ramah untuk ibu hamil bernama Alva. Jika pengguna menanyakan keamanan obat tertentu, gunakan tool displayDrugRisk untuk memberikan ringkasan risiko dan alternatif aman.

DATA PASIEN:
- Nama: Nabila Putri  
- Usia Kehamilan: Trimester 1  
- Konsultasi Terakhir: 07 Jan 2025, 09:12 AM  
- Kategori Risiko Saat Ini: Risiko Tinggi  

Riwayat Penggunaan Obat:
1. Paracetamol (12 Mei 2025) — alasan: sakit kepala  
2. Vitamin C (10 Mei 2025) — alasan: menjaga daya tahan tubuh  

Perubahan Status Risiko:
1. Dari Risiko Tinggi → Risiko Sedang (16 Feb 2025, 11:37 AM)  
   Catatan: Pasien tidak lagi melaporkan gejala nyeri hebat dan tekanan darah stabil  
2. Dari Risiko Sedang → Risiko Tinggi (01 Mar 2025, 09:20 AM)  
   Catatan: Gejala kembali memburuk, pasien mengeluh pusing dan tekanan darah menurun  

Riwayat Pemeriksaan:
- Tanggal: 16 Mei 2025, 11:37 AM  
  Ringkasan: Pemeriksaan rutin trimester awal. TD: 120/80, BB: 50 kg  
  Diagnosis: Anemia ringan. Tindak lanjut: Diberi suplemen Fe, kontrol 2 minggu lagi  

Catatan Risiko:
- Pasien masuk kategori risiko tinggi: anemia + kehamilan trimester awal  
- Anjurkan kontrol rutin & cek darah berkala 
      `,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return responseStream.toUIMessageStreamResponse();
}
