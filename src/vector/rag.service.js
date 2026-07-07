import {
  semanticSearch,
} from "./retrieval.service.js";

export const buildRAGContext = async (
  query
) => {

  try {

    const results =
      await semanticSearch(query);

    if (
      !results ||
      results.length === 0
    ) {
      return {
        context: "",
        sources: [],
      };
    }

    const sources = results.map((result, index) => ({
      chunk: index + 1,
      source: result.metadata?.source || "unknown",
      distance: result.distance,
      metadata: result.metadata || {},
    }));

    const formattedResults = results
      .map((result, index) => {
        const source =
          result.metadata?.source || "unknown";
        const distance =
          typeof result.distance === "number"
            ? result.distance.toFixed(4)
            : "unknown";

        return `Chunk ${index + 1}
Source: ${source}
Distance: ${distance}
Content:
${result.text}`;
      })
      .join("\n\n");

    return {
      context: `
Relevant Knowledge Context:

${formattedResults}
`,
      sources,
    };

  } catch (error) {

    console.error(
      "RAG Context Error:",
      error.message
    );

    return {
      context: "",
      sources: [],
    };
  }
};