import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

import { searchKnowledgeArgsSchema } from "../src/tools/search-knowledge.schema.js";
import { createToolRegistry } from "../src/tools/tool.registry.js";
import { executeTool } from "../src/tools/tool.executor.js";

test("search_knowledge schema accepts query and default limit", () => {
  const result = searchKnowledgeArgsSchema.safeParse({
    query: "  vector database  ",
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    query: "vector database",
    limit: 3,
  });
});

test("search_knowledge schema rejects empty query", () => {
  const result = searchKnowledgeArgsSchema.safeParse({
    query: "   ",
  });

  assert.equal(result.success, false);
});

test("search_knowledge schema rejects limit above max", () => {
  const result = searchKnowledgeArgsSchema.safeParse({
    query: "RAG",
    limit: 50,
  });

  assert.equal(result.success, false);
});

test("executeTool rejects unknown tools", async () => {
  const registry = createToolRegistry([]);

  await assert.rejects(
    () =>
      executeTool(
        {
          name: "delete_everything",
          arguments: {},
        },
        registry
      ),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /Unknown tool/);
      return true;
    }
  );
});

test("executeTool rejects invalid arguments", async () => {
  const fakeTool = {
    name: "search_knowledge",
    description: "fake",
    parameters: {},
    argsSchema: searchKnowledgeArgsSchema,
    execute: async () => ({ count: 0, results: [] }),
  };

  const registry = createToolRegistry([fakeTool]);

  await assert.rejects(
    () =>
      executeTool(
        {
          name: "search_knowledge",
          arguments: {
            query: "",
          },
        },
        registry
      ),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "Invalid tool arguments");
      return true;
    }
  );
});

test("executeTool runs a registered tool with valid arguments", async () => {
  const fakeTool = {
    name: "echo_tool",
    description: "Returns the query",
    parameters: {},
    argsSchema: z
      .object({
        query: z.string().trim().min(1),
      })
      .strict(),
    execute: async ({ query }) => ({ echoed: query }),
  };

  const registry = createToolRegistry([fakeTool]);

  const result = await executeTool(
    {
      name: "echo_tool",
      arguments: {
        query: "hello tools",
      },
    },
    registry
  );

  assert.deepEqual(result, {
    tool: "echo_tool",
    arguments: {
      query: "hello tools",
    },
    result: {
      echoed: "hello tools",
    },
  });
});
