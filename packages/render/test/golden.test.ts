// The hero's rendering must reproduce every hand-written example in sources/*/examples
// (payload, envelope, ids and narrative), and rendering must be deterministic.
import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { hero } from "../../truth/src/hero.ts";
import { renderPatient } from "../src/index.ts";
import { REPO, toMarkdown } from "../src/item.ts";
import { validateNarrative } from "../src/validate.ts";
import { compareFixtures } from "./golden-lib.ts";

const items = renderPatient(hero(), "golden");

test("every example is reproduced by the hero render", () => {
  const examples = ["riverside", "northgate", "lakeview", "homelog"].flatMap((d) => readdirSync(join(REPO, "sources", d, "examples")).map((f) => `${d}/${f}`));
  const results = compareFixtures(items);
  expect(results.map((r) => r.file).sort()).toEqual(examples.sort());
  for (const r of results) expect({ file: r.file, diffs: r.diffs }).toEqual({ file: r.file, diffs: [] });
});

test("rendering is deterministic", () => {
  const again = renderPatient(hero(), "golden");
  expect(again.map((i) => toMarkdown(i.item))).toEqual(items.map((i) => toMarkdown(i.item)));
});

test("validator: exact-once refs, spans, negations, forbidden and sensitive words", () => {
  const req = {
    key: "k", source: "B" as const, docKind: "x", when: "", mode: "markdown" as const, length: "", style: "",
    refs: [{ id: "alg_1", about: "lisinopril cough" }],
    spans: [{ id: "sick_day", statement: "sick day rules", evidence: [["sick[- ]day"]] }],
    mustInclude: [{ statement: "no angioedema", evidence: [["no (lip|tongue)"]] }],
    context: [], forbidden: [{ statement: "precipitant", pattern: "gastroenteritis" }],
    sensitive: [{ pattern: "sertraline", allowedIn: ["med_s"] }],
  };
  const good = '<ref id="alg_1">Cough on lisinopril.</ref> No lip swelling. <ref id="sick_day">Sick day rules reviewed.</ref>';
  expect(validateNarrative(good, req)).toEqual([]);
  expect(validateNarrative(good + ' <ref id="alg_1">again</ref>', req).join()).toContain("exactly once");
  expect(validateNarrative(good.replace("No lip swelling.", ""), req).join()).toContain("must state");
  expect(validateNarrative(good + " After gastroenteritis.", req).join()).toContain("must not mention");
  expect(validateNarrative(good + " On sertraline.", req).join()).toContain("sensitive");
  expect(validateNarrative('<ref id="alg_1">a <ref id="sick_day">b</ref></ref> no lip', req).join()).toContain("nested");
});
