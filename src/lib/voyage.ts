import { VoyageAIClient } from "voyageai";

const voyageClient = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

export default voyageClient;

// how to use:
// await client.embed({
//     input: "input text",
//     model: "voyage-3.5-lite",
// });
