import axios from "axios";
import { config } from "../config/runtime.config.js";

export const generateChatResponse = async ({
  messages,
  knowledgeContext = "",
}) => {
  try {
    const conversationText =
      messages
        .map(
          (msg) =>
            `${msg.role.toUpperCase()}: ${msg.content}`
        )
        .join("\n");

    const finalPrompt = `
You are a senior AI backend engineering assistant.

Rules:
- Answer in simple and clear English.
- Use the knowledge context only when it is relevant to the user's question.
- If the knowledge context is empty or does not contain the answer, say that the available context does not contain enough information.
- Do not invent facts, file names, APIs, or project details that are not present in the conversation or knowledge context.
- If the question is general and does not require private knowledge, answer from general AI/backend knowledge.

Knowledge Context:
${knowledgeContext || "No relevant knowledge context was found."}

Conversation:

${conversationText}

ASSISTANT:
`;
    console.log("FINAL PROMPT:\n",finalPrompt);
    const response = await axios.post(
      config.ollama.generateUrl,
      {
        model: config.ollama.chatModel,

        prompt: finalPrompt,

        stream: false,

        options: {
          temperature: 0.2,
          num_predict: 100,
        },
      }
    );

    return response.data.response;

  } catch (error) {
    console.error(
      "OLLAMA FULL ERROR:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to generate AI response"
    );
  }
};