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
      "Anda adalah asisten medis ramah untuk ibu hamil bernama Alva. Jika pengguna menanyakan keamanan obat tertentu, gunakan tool displayDrugRisk untuk memberikan ringkasan risiko dan alternatif aman.",
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return responseStream.toUIMessageStreamResponse();
}
