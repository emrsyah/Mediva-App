import { tool as createTool } from "ai";
import { z } from "zod";
import voyageClient from "@/lib/voyage";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { generateFinalRecommendation } from "./utils";

// Define the type for drug data
export type DrugData = {
  drugName: string;
  category: string;
  recommendation: string;
  alternatives: { name: string; description: string }[];
  finalRecommendation: string;
};

// Helper to fetch the most relevant drug information from Supabase using
// the `find_similar_drugs` Postgres function. This function performs a
// pgvector-powered semantic search against the `drugs` table.
async function fetchDrugInfo(drugName: string): Promise<DrugData | null> {
  // 1. Generate an embedding for the query
  const embedRes = await voyageClient.embed({
    input: drugName,
    model: "voyage-3.5",
  });

  const queryEmbedding = embedRes.data?.[0]?.embedding ?? [];

  // 2. Query Supabase via the RPC that wraps pgvector similarity search
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("find_similar_drugs", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 5,
  });

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const [primary] = data;

  if (primary.Name.toLowerCase() !== drugName.toLowerCase()) {
    return null;
  }

  const finalRecommendation = await generateFinalRecommendation({
    drugName: primary.Name as string,
    category: primary.Category as string,
    recommendation: (primary["Safety statement"] ?? "Tidak ada data.") as string,
    alternatives: [] as { name: string; description: string }[],
    finalRecommendation: "",
  });

  const result: DrugData = {
    drugName: primary.Name as string,
    category: primary.Category as string,
    recommendation: (primary["Safety statement"] ?? "Tidak ada data.") as string,
    alternatives: [] as { name: string; description: string }[],
    finalRecommendation: finalRecommendation as string,
  };

  return result;
}

// DrugRisk tool: only fetch and return drug information, no confirmation logic here.
export const drugRiskTool = createTool({
  description:
    "Display pregnancy risk information for a drug and safe alternatives if needed.",
  inputSchema: z.object({
    drugName: z.string().describe("The drug name to check"),
  }),
  execute: async ({ drugName }: { drugName: string }) => {
    // Attempt to fetch from Supabase. If it fails or no match is found,
    // fall back to a generic advisory response.
    try {
      const info = await fetchDrugInfo(drugName);
      if (info) {
        return {
          ...info,
          isFound: true,
        };
      }
    } catch (err) {
      console.error("Drug RAG lookup failed", err);
    }

    return {
      drugName,
      category: "",
      recommendation: "",
      alternatives: [],
      isFound: false,
    };
  },
});

// Tool to confirm drug consumption, intended to be called after presenting the info
export const confirmDrugConsumptionTool = createTool({
  description:
    "Ask the user to confirm if they have consumed or are currently consuming a specified drug. Use this after providing them drug risk information.",
  inputSchema: z.object({
    drugName: z.string().describe("The drug name to confirm consumption"),
  }),
  execute: async ({ drugName }: { drugName: string }) => {
    return {
      message: `For clarification, have you consumed or are you currently consuming "${drugName}"? Please answer 'yes' or 'no'.`,
      drugName,
      confirmationRequested: true,
    };
  },
});

export const tools = {
  displayDrugRisk: drugRiskTool,
  confirmDrugConsumption: confirmDrugConsumptionTool,
};
