import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { DrugData } from "./tools";

export const generateFinalRecommendation = async (drugData: DrugData) => {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      finalRecommendation: z.enum([
        "Aman untuk dikonsumsi",
        "Aman untuk dikonsumsi dengan catatan",
        "Tidak aman untuk dikonsumsi",
      ]),
    }),
    prompt: `Generate a final recommendation for the drug ${drugData.drugName} based on the following information: ${drugData}`,
  });

  return object.finalRecommendation;
};
