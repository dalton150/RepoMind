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
      return "";
    }

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

    return `
Relevant Knowledge Context:

${formattedResults}
`;

  } catch (error) {

    console.error(
      "RAG Context Error:",
      error.message
    );

    return "";
  }
};