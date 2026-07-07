import axios from "axios";
import { config } from "../config/runtime.config.js";

export const generateEmbedding = async (
  text
) => {

  try {

    const response = await axios.post(
      config.ollama.embeddingsUrl,
      {
        model: config.ollama.embeddingModel,
        prompt: text,
      }
    );

    return response.data.embedding;

  } catch (error) {

    console.error(
      "Embedding Error:",
      error.message
    );

    throw new Error(
      "Failed to generate embedding"
    );
  }
};