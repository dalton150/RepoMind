import { ChromaClient }
  from "chromadb";
import { config } from "../config/runtime.config.js";

const chroma = new ChromaClient({
  path: config.chroma.url,
});

export default chroma;