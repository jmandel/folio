// The examples in spec/record-item.md and spec/signing.md agree with the code.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { itemToClaims, parseJson, parseMarkdown, toMarkdown, validateItem, type Item } from "../src/index.ts";
import { ROOT } from "./fixtures.ts";

const recordItem = readFileSync(join(ROOT, "spec", "record-item.md"), "utf8");
const mdExamples = [...recordItem.matchAll(/~~~~markdown\n([\s\S]*?)~~~~/g)].map((m) => m[1]);

test("record-item.md Markdown examples parse, validate and round-trip", () => {
  expect(mdExamples.length).toBe(2);
  for (const md of mdExamples) {
    const item = parseMarkdown(md);
    expect(validateItem(item)).toEqual([]);
    expect(toMarkdown(item)).toBe(md);
  }
});

test("record-item.md JSON form example equals the parsed lab example", () => {
  const json = recordItem.match(/The JSON form of the same item:\n\n```json\n([\s\S]*?)\n```/)![1];
  expect(parseJson(json)).toEqual(parseMarkdown(mdExamples[1]));
});

test("signing.md example claims", () => {
  const item = { ...parseMarkdown(mdExamples[1]), narrative: 'Na 132. <ref id="dx_na">Hyponatremia</ref>, mild.',
    payload: { dx_na: { type: "dx", icd10cm: "E87.1" }, na_lab: { type: "lab", value: 132 } } } as Item;
  const c = itemToClaims(item);
  expect(c.narrative).toEqual(["Na 132. ", ", mild."]);
  expect(c.units).toEqual({
    dx_na: { entry: { type: "dx", icd10cm: "E87.1" }, pos: 0, spans: [{ slot: 0, text: "Hyponatremia" }] },
    na_lab: { entry: { type: "lab", value: 132 }, pos: 1 },
  });
});
