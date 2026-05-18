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

    return `
Relevant Knowledge Context:

${results.join("\n\n")}
`;

  } catch (error) {

    console.error(
      "RAG Context Error:",
      error.message
    );

    return "";
  }
};