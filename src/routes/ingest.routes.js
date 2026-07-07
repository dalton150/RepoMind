import express from "express";

import {
  ingestDocument,
} from "../vector/ingestion.service.js";
import {
  ingestRequestSchema,
  validateBody,
} from "../validation.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = express.Router();

router.post("/", validateBody(ingestRequestSchema), asyncHandler(async (req, res) => {

  const { text, source } =
    req.body;

  const result =
    await ingestDocument({
      text,
      source,
    });

  return res.json({
    success: true,
    data: result,
  });
}));

export default router;