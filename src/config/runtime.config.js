import "dotenv/config";

const trimTrailingSlash = (value) => value.replace(/\/$/, "");

const OLLAMA_BASE_URL = trimTrailingSlash(
  process.env.OLLAMA_BASE_URL || "http://localhost:11434"
);

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  ollama: {
    baseUrl: OLLAMA_BASE_URL,
    generateUrl: `${OLLAMA_BASE_URL}/api/generate`,
    embeddingsUrl: `${OLLAMA_BASE_URL}/api/embeddings`,
    chatModel: process.env.OLLAMA_CHAT_MODEL || "gemma:2b",
    embeddingModel:
      process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
  },
  chroma: {
    url: process.env.CHROMA_URL || "http://localhost:8000",
  },
};
