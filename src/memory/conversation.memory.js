import Conversation from "../models/conversation.model.js";

const MAX_CONTEXT_MESSAGES = 10;

export const getOrCreateConversation = async (
  conversationId
) => {

  let conversation = await Conversation.findOne({
    conversationId,
  });

  if (!conversation) {

    conversation = await Conversation.create({
      conversationId,
      messages: [],
    });
  }

  return conversation;
};

export const addMessageToConversation = async (
  conversationId,
  role,
  content
) => {

  const conversation =
    await getOrCreateConversation(conversationId);

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();

  return conversation;
};

export const buildConversationContext = async (
  conversationId
) => {

  const conversation =
    await getOrCreateConversation(conversationId);

  const recentMessages =
    conversation.messages.slice(
      -MAX_CONTEXT_MESSAGES
    );

  return recentMessages;
};