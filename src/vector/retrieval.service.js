import {
  getCollection,
} from "./vector.store.js";

import {
  generateEmbedding,
} from "./embedding.service.js";
import { config } from "../config/runtime.config.js";
import {
  filterMatchesByDistance,
} from "./retrieval.utils.js";

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
        include: ["documents", "metadatas", "distances"],
      });

    const documents = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];
    const distances = results.distances?.[0] || [];

    const matches = documents.map((document, index) => ({
      text: document,
      metadata: metadatas[index] || {},
      distance: distances[index],
    }));

    return filterMatchesByDistance(
      matches,
      config.rag.maxDistance
    );

  } catch (error) {

    console.error(
      "Semantic Search Error:",
      error.message
    );

    return [];
  }
};