import { v4 as uuidv4 } from "uuid";

import {
  addMessageToConversation,
  buildConversationContext,
} from "../memory/conversation.memory.js";
import { runToolLoop } from "../tools/tool-loop.service.js";
import { config } from "../config/runtime.config.js";

export const chatHandler = async (req, res) => {
  let { message, conversationId } = req.body;

  if (!conversationId) {
    conversationId = uuidv4();
  }

  await addMessageToConversation(
    conversationId,
    "user",
    message
  );

  const messages = await buildConversationContext(conversationId);

  const {
    answer,
    toolCalls,
    sources,
    steps,
  } = await runToolLoop({
    messages,
    maxSteps: config.tools.maxSteps,
  });

  await addMessageToConversation(
    conversationId,
    "assistant",
    answer
  );

  return res.status(200).json({
    success: true,
    conversationId,
    data: answer,
    sources,
    toolCalls,
    steps,
  });
};
