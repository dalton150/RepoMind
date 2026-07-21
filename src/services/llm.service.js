import axios from "axios";
import { config } from "../config/runtime.config.js";

const formatMessages = (messages) =>
  messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");

const formatTools = (tools) => {
  if (!tools.length) {
    return "No tools available.";
  }

  return tools
    .map(
      (tool) =>
        `- ${tool.name}: ${tool.description}\n  parameters: ${JSON.stringify(tool.parameters)}`
    )
    .join("\n");
};

const formatToolHistory = (toolHistory) => {
  if (!toolHistory.length) {
    return "No tool results yet.";
  }

  return toolHistory
    .map((entry, index) => {
      if (entry.error) {
        return `Tool Step ${index + 1}
Tool: ${entry.request.name}
Arguments: ${JSON.stringify(entry.request.arguments)}
Error: ${entry.error}`;
      }

      return `Tool Step ${index + 1}
Tool: ${entry.response.tool}
Arguments: ${JSON.stringify(entry.response.arguments)}
Result: ${JSON.stringify(entry.response.result)}`;
    })
    .join("\n\n");
};

export const buildToolAwarePrompt = ({
  messages,
  tools = [],
  toolHistory = [],
  forceFinalAnswer = false,
}) => {
  const finalInstruction = forceFinalAnswer
    ? "You must now give the final answer in normal text only. Do not call any more tools."
    : `If you need a tool, reply with ONLY this JSON object and nothing else:
{"tool":"tool_name","arguments":{}}

If you can answer without a tool, reply with normal text only.
Do not wrap JSON in markdown.`;

  return `
You are a senior AI backend engineering assistant.

Rules:
- Answer in simple and clear English.
- Use tools only when you need private knowledge or stored document search.
- Do not invent facts from tools that were not returned.
- If tool results are empty or not useful, say that clearly.

Available tools:
${formatTools(tools)}

Tool results so far:
${formatToolHistory(toolHistory)}

Conversation:
${formatMessages(messages)}

${finalInstruction}

ASSISTANT:
`.trim();
};

export const generateModelText = async (prompt) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("FINAL PROMPT:\n", prompt);
    }

    const response = await axios.post(
      config.ollama.generateUrl,
      {
        model: config.ollama.chatModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: config.ollama.numPredict,
        },
      }
    );

    return response.data.response;
  } catch (error) {
    console.error(
      "OLLAMA FULL ERROR:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate AI response");
  }
};

export const generateChatResponse = async ({
  messages,
  knowledgeContext = "",
}) => {
  const conversationText = formatMessages(messages);

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
`.trim();

  return generateModelText(finalPrompt);
};
