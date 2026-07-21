import { semanticSearch } from "../vector/retrieval.service.js";
import { searchKnowledgeArgsSchema } from "./search-knowledge.schema.js";

export { searchKnowledgeArgsSchema };

export const searchKnowledgeTool = {
  name: "search_knowledge",

  description:
    "Search the private knowledge base for relevant document chunks using semantic search. Use this when the user asks about stored documents or project knowledge.",

  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search text",
      },
      limit: {
        type: "number",
        description: "Max chunks to return. Default is 3. Max is 10.",
      },
    },
    required: ["query"],
  },

  argsSchema: searchKnowledgeArgsSchema,

  async execute({ query, limit }) {
    const results = await semanticSearch(query, limit);

    return {
      count: results.length,
      results: results.map((result, index) => ({
        chunk: index + 1,
        text: result.text,
        source: result.metadata?.source || "unknown",
        distance: result.distance,
        metadata: result.metadata || {},
      })),
    };
  },
};
