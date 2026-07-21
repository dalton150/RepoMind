import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

import { parseModelOutput } from "../src/tools/tool-call.parser.js";
import { createToolRegistry } from "../src/tools/tool.registry.js";
import { runToolLoop } from "../src/tools/tool-loop.service.js";

test("parseModelOutput detects a tool call JSON object", () => {
  const parsed = parseModelOutput(
    '{"tool":"search_knowledge","arguments":{"query":"RAG","limit":3}}'
  );

  assert.deepEqual(parsed, {
    type: "tool_call",
    name: "search_knowledge",
    arguments: {
      query: "RAG",
      limit: 3,
    },
  });
});

test("parseModelOutput treats normal text as final answer", () => {
  const parsed = parseModelOutput("RAG retrieves useful context first.");

  assert.deepEqual(parsed, {
    type: "final",
    content: "RAG retrieves useful context first.",
  });
});

test("parseModelOutput extracts tool JSON from surrounding text", () => {
  const parsed = parseModelOutput(
    'Sure.\n{"tool":"search_knowledge","arguments":{"query":"embeddings"}}\n'
  );

  assert.equal(parsed.type, "tool_call");
  assert.equal(parsed.name, "search_knowledge");
  assert.deepEqual(parsed.arguments, {
    query: "embeddings",
  });
});

test("runToolLoop executes a tool then returns final answer", async () => {
  const fakeTool = {
    name: "search_knowledge",
    description: "fake search",
    parameters: {},
    argsSchema: z
      .object({
        query: z.string().min(1),
      })
      .strict(),
    execute: async ({ query }) => ({
      count: 1,
      results: [
        {
          chunk: 1,
          text: `Result for ${query}`,
          source: "notes.txt",
          distance: 0.2,
          metadata: { source: "notes.txt" },
        },
      ],
    }),
  };

  const registry = createToolRegistry([fakeTool]);
  let callCount = 0;

  const generateText = async () => {
    callCount += 1;

    if (callCount === 1) {
      return JSON.stringify({
        tool: "search_knowledge",
        arguments: {
          query: "vector database",
        },
      });
    }

    return "A vector database stores embeddings for similarity search.";
  };

  const result = await runToolLoop({
    messages: [
      {
        role: "user",
        content: "What is a vector database in my notes?",
      },
    ],
    registry,
    maxSteps: 3,
    generateText,
  });

  assert.equal(
    result.answer,
    "A vector database stores embeddings for similarity search."
  );
  assert.equal(result.steps, 2);
  assert.equal(result.toolCalls.length, 1);
  assert.equal(result.toolCalls[0].success, true);
  assert.equal(result.sources[0].source, "notes.txt");
});
