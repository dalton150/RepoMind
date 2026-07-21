import {
  buildToolAwarePrompt,
  generateModelText,
} from "../services/llm.service.js";
import { parseModelOutput } from "./tool-call.parser.js";
import { executeTool } from "./tool.executor.js";

const collectSourcesFromToolResult = (toolName, result) => {
  if (toolName !== "search_knowledge" || !result?.results) {
    return [];
  }

  return result.results.map((item) => ({
    chunk: item.chunk,
    source: item.source,
    distance: item.distance,
    metadata: item.metadata || {},
  }));
};

export const runToolLoop = async ({
  messages,
  registry,
  maxSteps = 3,
  generateText = generateModelText,
}) => {
  const activeRegistry =
    registry ??
    (await import("./default-tool.registry.js")).defaultToolRegistry;

  const tools = activeRegistry.listTools();
  const toolHistory = [];
  const sources = [];
  const toolCalls = [];

  for (let step = 0; step < maxSteps; step += 1) {
    const isLastStep = step === maxSteps - 1;

    const prompt = buildToolAwarePrompt({
      messages,
      tools,
      toolHistory,
      forceFinalAnswer: isLastStep,
    });

    const rawOutput = await generateText(prompt);
    const parsed = parseModelOutput(rawOutput);

    if (parsed.type === "final") {
      return {
        answer: parsed.content,
        toolCalls,
        sources,
        steps: step + 1,
      };
    }

    if (isLastStep) {
      return {
        answer: rawOutput,
        toolCalls,
        sources,
        steps: step + 1,
      };
    }

    try {
      const executed = await executeTool(
        {
          name: parsed.name,
          arguments: parsed.arguments,
        },
        activeRegistry
      );

      toolHistory.push({
        request: parsed,
        response: executed,
      });

      toolCalls.push({
        tool: executed.tool,
        arguments: executed.arguments,
        success: true,
      });

      sources.push(
        ...collectSourcesFromToolResult(
          executed.tool,
          executed.result
        )
      );
    } catch (error) {
      toolHistory.push({
        request: parsed,
        error: error.message,
        details: error.details || [],
      });

      toolCalls.push({
        tool: parsed.name,
        arguments: parsed.arguments,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    answer: "I could not complete the request within the tool step limit.",
    toolCalls,
    sources,
    steps: maxSteps,
  };
};
