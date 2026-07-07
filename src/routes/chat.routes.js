import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import {
  chatRequestSchema,
  validateBody,
} from "../validation.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = express.Router();

router.post(
  "/",
  validateBody(chatRequestSchema),
  asyncHandler(chatHandler)
);

export default router;