import { searchKnowledgeTool } from "./search-knowledge.tool.js";
import { createToolRegistry } from "./tool.registry.js";

export const defaultToolRegistry = createToolRegistry([
  searchKnowledgeTool,
]);
