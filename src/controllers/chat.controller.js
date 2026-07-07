import { v4 as uuidv4 } from "uuid";

import {addMessageToConversation,buildConversationContext,} from "../memory/conversation.memory.js";
import { generateChatResponse } from "../services/llm.service.js";

import {buildRAGContext,} from "../vector/rag.service.js";

export const chatHandler = async (req,res) => {
  let {message,conversationId,} = req.body;
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
    context: knowledgeContext,
    sources,
  } = await buildRAGContext(message);

  const aiResponse = await generateChatResponse({messages,knowledgeContext,});
  await addMessageToConversation(
    conversationId,
    "assistant",
    aiResponse
  );
  return res.status(200).json({
    success: true,
    conversationId,
    data: aiResponse,
    sources,
  });
};