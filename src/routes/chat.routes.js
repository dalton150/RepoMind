import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import {
  chatRequestSchema,
  validateBody,
} from "../validation.js";

const router = express.Router();

router.post(
  "/",
  validateBody(chatRequestSchema),
  chatHandler
);

export default router;