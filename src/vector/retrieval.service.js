import {
  getCollection,
} from "./vector.store.js";

import {
  generateEmbedding,
} from "./embedding.service.js";

export const semanticSearch = async (
  query,
  limit = 3
) => {

  try {

    const collection =
      await getCollection();

    const embedding =
      await generateEmbedding(query);

    const results =
      await collection.query({
        queryEmbeddings: [embedding],
        nResults: limit,
      });

    return results.documents?.[0] || [];

  } catch (error) {

    console.error(
      "Semantic Search Error:",
      error.message
    );

    return [];
  }
};