import test from "node:test";
import assert from "node:assert/strict";

import {
  filterMatchesByDistance,
} from "../src/vector/retrieval.utils.js";

const matches = [
  {
    text: "close match",
    metadata: { source: "a.txt" },
    distance: 0.4,
  },
  {
    text: "borderline match",
    metadata: { source: "b.txt" },
    distance: 0.8,
  },
  {
    text: "weak match",
    metadata: { source: "c.txt" },
    distance: 1.4,
  },
];

test("returns all matches when threshold is disabled", () => {
  const filtered = filterMatchesByDistance(matches, null);

  assert.deepEqual(filtered, matches);
});

test("keeps matches with distance less than or equal to threshold", () => {
  const filtered = filterMatchesByDistance(matches, 0.8);

  assert.deepEqual(filtered, [matches[0], matches[1]]);
});

test("removes matches with missing distance when threshold is enabled", () => {
  const filtered = filterMatchesByDistance(
    [
      ...matches,
      {
        text: "missing distance",
        metadata: { source: "d.txt" },
      },
    ],
    0.8
  );

  assert.deepEqual(filtered, [matches[0], matches[1]]);
});
