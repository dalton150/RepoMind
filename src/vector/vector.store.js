import chroma from "./chroma.client.js";

import {
  generateEmbedding,
} from "./embedding.service.js";

const COLLECTION_NAME =
  "ai-knowledge-base";

export const getCollection = async () => {
 return await chroma.getOrCreateCollection({
  name: COLLECTION_NAME,
  embeddingFunction: null,
});
};

export const storeDocument = async ({
  id,
  text,
  metadata = {},
}) => {

  const collection =
    await getCollection();

  const embedding =
    await generateEmbedding(text);

  await collection.add({
    ids: [id],

    documents: [text],

    embeddings: [embedding],

    metadatas: [metadata],
  });
};