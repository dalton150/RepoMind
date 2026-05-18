import { v4 as uuidv4 }
  from "uuid";

import { chunkText }
  from "./chunking.service.js";

import { storeDocument }
  from "./vector.store.js";

export const ingestDocument = async ({
  text,
  source = "unknown",
}) => {

  const chunks =
    chunkText(text);

  for (const chunk of chunks) {

    await storeDocument({
      id: uuidv4(),

      text: chunk,

      metadata: {
        source,
      },
    });
  }

  return {
    success: true,
    chunksStored: chunks.length,
  };
};