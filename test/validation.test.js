import test from "node:test";
import assert from "node:assert/strict";

import {
  chatRequestSchema,
  ingestRequestSchema,
} from "../src/validation.js";

test("chat schema accepts and trims a valid message", () => {
  const result = chatRequestSchema.safeParse({
    message: "  What is RAG?  ",
    conversationId: "  conversation-1  ",
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    message: "What is RAG?",
    conversationId: "conversation-1",
  });
});

test("chat schema rejects an empty message", () => {
  const result = chatRequestSchema.safeParse({
    message: "   ",
  });

  assert.equal(result.success, false);
});

test("chat schema rejects unknown fields", () => {
  const result = chatRequestSchema.safeParse({
    message: "Hello",
    role: "admin",
  });

  assert.equal(result.success, false);
});

test("ingest schema accepts and trims valid text and source", () => {
  const result = ingestRequestSchema.safeParse({
    text: "  Vector databases store embeddings.  ",
    source: "  notes.txt  ",
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    text: "Vector databases store embeddings.",
    source: "notes.txt",
  });
});

test("ingest schema rejects empty text", () => {
  const result = ingestRequestSchema.safeParse({
    text: "",
  });

  assert.equal(result.success, false);
});

test("ingest schema rejects unknown fields", () => {
  const result = ingestRequestSchema.safeParse({
    text: "Some document text",
    userId: "user-1",
  });

  assert.equal(result.success, false);
});
