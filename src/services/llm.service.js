import axios from "axios";

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

Use the provided knowledge context
to answer accurately.

${knowledgeContext}

Conversation:

${conversationText}

ASSISTANT:
`;
    console.log("FINAL PROMPT:\n",finalPrompt);
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma:2b",

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