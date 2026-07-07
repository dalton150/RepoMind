import test from "node:test";
import assert from "node:assert/strict";

import { chunkText } from "../src/vector/chunking.service.js";

test("returns one chunk when text is smaller than chunk size", () => {
  const chunks = chunkText("hello world", 50, 10);

  assert.deepEqual(chunks, ["hello world"]);
});

test("splits text into overlapping chunks", () => {
  const chunks = chunkText("abcdefghijklmnopqrstuvwxyz", 10, 3);

  assert.deepEqual(chunks, [
    "abcdefghij",
    "hijklmnopq",
    "opqrstuvwx",
    "vwxyz",
  ]);
});

test("returns an empty array for empty text", () => {
  const chunks = chunkText("", 10, 3);

  assert.deepEqual(chunks, []);
});
