import { z } from "zod";

export const searchKnowledgeArgsSchema = z
  .object({
    query: z
      .string()
      .trim()
      .min(1, "Query is required")
      .max(2000, "Query is too long"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .default(3),
  })
  .strict();
