import { z } from "zod";

export const chatRequestSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(8000, "Message is too long"),
    conversationId: z
      .string()
      .trim()
      .min(1, "Conversation ID cannot be empty")
      .max(200, "Conversation ID is too long")
      .optional(),
  })
  .strict();

export const ingestRequestSchema = z
  .object({
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(100000, "Text is too long"),
    source: z
      .string()
      .trim()
      .min(1, "Source cannot be empty")
      .max(500, "Source is too long")
      .optional(),
  })
  .strict();

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return next();
};
