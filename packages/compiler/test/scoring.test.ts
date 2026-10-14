// Scorer sanity: the hand-written Northgate reference mapper scores 100% against the per-source keys,
// and each deliberately broken variant loses exactly where its break should show (by trap).
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateTransform } from "../src/evaluate.ts";

const ref = readFileSync(join(import.meta.dir, "fixtures/northgate-reference.ts"), "utf8");
const run = (src: string) => evaluateTransform(src, "northgate", "app", "test");
const patch = (from: string, to: string) => {
  if (!ref.includes(from)) throw new Error(`patch target missing: ${from}`);
  return ref.replace(from, to);
};
const rate = (ev: ReturnType<typeof run>, t: string) => ev.traps[t] ? ev.traps[t].errors / ev.traps[t].facts : 0;

describe("northgate reference mapper", () => {
  const ev = run(ref);
  test("agrees with the keys", () => {
    expect(ev.tsc.ok).toBe(true);
    expect(ev.deterministic).toBe(true);
    expect(ev.counts.all.recall).toBe(1);
    expect(ev.counts.all.precision).toBe(1);
  });
});

describe("reference mappers for the other sources agree with their keys", () => {
  for (const source of ["lakeview", "riverside", "homelog"] as const) test(source, () => {
    const ev = evaluateTransform(readFileSync(join(import.meta.dir, `fixtures/${source}-reference.ts`), "utf8"), source, "app", "test");
    expect(ev.counts.all.recall).toBe(1);
    expect(ev.counts.all.precision).toBe(1);
  });
});

describe("broken variants are caught", () => {
  test("ignoring supersedes/retracts: withdrawn K shows (T3) and voided lines count (T4)", () => {
    const ev = run(patch("const dead = new Set<string>();", "const dead = new Set<string>(); const _ignore = new Set<string>();").replace("dead.add(id);", "_ignore.add(id);"));
    expect(rate(ev, "T4")).toBeGreaterThan(0.3);
    expect(ev.anti.some((a) => a.trap === "T3")).toBe(true);
    expect(ev.counts.all.precision!).toBeLessThan(1);
  });
  test("hold read as stopped (T1)", () => {
    const ev = run(patch(`const status = e.action === "stop" ? "stopped" : e.action === "hold" ? "held" : "active";`, `const status = e.action === "stop" || e.action === "hold" ? "stopped" : "active";`));
    expect(ev.traps.T1.errors).toBeGreaterThan(0);
  });
  test("platelets not rescaled (T7)", () => {
    const ev = run(patch(`if (e.unit === "cells/uL") value = value / 1000;`, ``));
    expect(rate(ev, "T7")).toBeGreaterThan(0.9);
  });
  test("race-coefficient eGFR rows kept (T11)", () => {
    const ev = run(patch(`"LK-EGFR09N": "egfr",`, `"LK-EGFR09N": "egfr", "LK-EGFR09A": "egfr",`));
    expect(ev.anti.filter((a) => a.trap === "T11").length).toBeGreaterThan(50);
  });
  test("year-only onset padded to a full date (T17)", () => {
    const ev = run(patch(`value: e.onset.precision === "year" ? e.onset.date.slice(0, 4) : e.onset.precision === "month" ? e.onset.date.slice(0, 7) : e.onset.date, precision: e.onset.precision } } : {}),
      ...(/^N18/`, `value: e.onset.date, precision: "day" } } : {}),
      ...(/^N18/`));
    expect(rate(ev, "T17")).toBeGreaterThan(0.5);
  });
});
