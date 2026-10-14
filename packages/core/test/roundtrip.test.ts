import { describe, expect, test } from "bun:test";
import { canonicalCopy, extractRefs, parseJson, parseMarkdown, toJson, toMarkdown, validateItem } from "../src/index.ts";
import { fixtures } from "./fixtures.ts";

const all = fixtures();

test("there are 31 fixtures", () => expect(all.length).toBe(31));

describe.each(all.map((f) => [`${f.source}/${f.file}`, f] as const))("%s", (_name, f) => {
  const item = parseMarkdown(f.text);

  test("validates structurally", () => expect(validateItem(item)).toEqual([]));

  test("md → item → md is byte-exact", () => expect(toMarkdown(item)).toBe(f.text));

  test("md → JSON → item is the same item, key order included", () => {
    const back = parseJson(toJson(item));
    expect(back).toEqual(item);
    expect(Object.keys(back)).toEqual(Object.keys(item));
    expect(Object.keys(back.payload)).toEqual(Object.keys(item.payload));
  });

  test("canonical Markdown (no remembered formatting) parses back to the same item", () => {
    const canon = toMarkdown(canonicalCopy(item));
    expect(parseMarkdown(canon)).toEqual(item);
    // The canonical frontmatter emitter reproduces the examples' frontmatter exactly.
    expect(canon.split("\n---\n")[0]).toBe(f.text.split("\n---\n")[0]);
  });

  test("ref offsets index the tag-free narrative in code points", () => {
    const { plain, spans, errors } = extractRefs(item.narrative);
    expect(errors).toEqual([]);
    const cps = [...plain];
    for (const s of spans) {
      expect(cps.slice(s.start, s.end).join("")).toBe(s.text);
      expect(item.narrative.slice(s.tagStart, s.tagEnd)).toBe(`<ref id="${s.id}">${s.text}</ref>`);
    }
  });
});

describe("parser and validator edge cases", () => {
  const base = `---\nfolio: "0.1"\nid: "01JB9D0R2K7M4P6S8V1X3Z5B7C"\nissuer: "did:web:x.example"\npatient: "P1"\neffective: "2026"\nrecorded: "2026-04-02T14:03:08-05:00"\n---\n`;
  test("narrative-only item, offsets count code points", () => {
    const it = parseMarkdown(base + `Naïve 🙂 <ref id="a">x</ref>\n`);
    expect(validateItem(it)).toEqual([]);
    expect(extractRefs(it.narrative).spans[0].start).toBe(8);
    expect(toMarkdown(it)).toBe(base + `Naïve 🙂 <ref id="a">x</ref>\n`);
  });
  test("lab-style '<' is text, literal <ref must be escaped", () => {
    expect(validateItem(parseMarkdown(base + "Troponin I <0.01, K <5\n"))).toEqual([]);
    expect(validateItem(parseMarkdown(base + "a <ref> b\n")).length).toBeGreaterThan(0);
    expect(validateItem(parseMarkdown(base + "a &lt;ref b\n"))).toEqual([]);
  });
  test("nesting, crossing paragraphs, raw HTML, bad ids are rejected", () => {
    for (const n of [
      `<ref id="a">x <ref id="b">y</ref></ref>`,
      `<ref id="a">x\n\ny</ref>`,
      `<ref id="a">x\n- y</ref>`,
      `<b>bold</b>`,
      `<ref id="A">x</ref>`,
      `<ref id="a" class="z">x</ref>`,
      `x</ref>`,
    ])
      expect(validateItem(parseMarkdown(base + n + "\n")).length).toBeGreaterThan(0);
  });
  test("envelope rules", () => {
    const it = parseMarkdown(base + "x\n");
    expect(validateItem({ ...it, recorded: "2026-04-02T14:03:08" }).map((i) => i.path)).toContain("recorded");
    expect(validateItem({ ...it, effective: "2026-04-02T14:03" }).map((i) => i.path)).toContain("effective");
    expect(validateItem({ ...it, payload: { a: { type: "t" } } }).map((i) => i.path)).toContain("schema");
    expect(validateItem({ ...it, narrative: "" }).map((i) => i.path)).toContain("item");
    expect(validateItem({ ...it, narrative: "", retracts: ["01JB9D0R2K7M4P6S8V1X3Z5B7D"] })).toEqual([]);
  });
  test("payload fence must be last; longer fences survive backticks", () => {
    expect(() => parseMarkdown(base + "x\n\n```json payload\n{}\n```\nmore\n")).toThrow();
    const it = { ...parseMarkdown(base + "x\n"), schema: { url: "https://x.example/s.d.ts", type: "E", sha256: "0".repeat(64) }, payload: { a: { type: "t", s: "```" } } };
    const md = toMarkdown(it);
    expect(md).toContain("````json payload");
    expect(parseMarkdown(md)).toEqual(it);
  });
});
