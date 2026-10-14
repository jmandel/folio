// Compares the hero's rendered items with the hand-written examples they must reproduce.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { hero } from "../../truth/src/hero.ts";
import { Ctx, SOURCE_DIR, type RenderedItem } from "../src/context.ts";
import { HERO_HINTS } from "../src/hero-hints.ts";
import { parseItem, REPO } from "../src/item.ts";

export function deepDiff(a: unknown, b: unknown, path = ""): string[] {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null) !== (b === null)) return [`${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`];
  if (Array.isArray(a)) {
    const bb = b as unknown[];
    if (a.length !== bb.length) return [`${path}: length ${a.length} != ${bb.length}`];
    return a.flatMap((x, i) => deepDiff(x, bb[i], `${path}[${i}]`));
  }
  if (a && typeof a === "object") {
    const ka = Object.keys(a as object), kb = Object.keys(b as object);
    const out: string[] = [];
    for (const k of new Set([...ka, ...kb])) {
      if (!(k in (a as object))) out.push(`${path}.${k}: missing in rendered (example has ${JSON.stringify((b as any)[k])})`);
      else if (!(k in (b as object))) out.push(`${path}.${k}: extra in rendered (${JSON.stringify((a as any)[k])})`);
      else out.push(...deepDiff((a as any)[k], (b as any)[k], `${path}.${k}`));
    }
    return out;
  }
  return a === b ? [] : [`${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`];
}

export function compareFixtures(items: RenderedItem[]): { file: string; diffs: string[] }[] {
  const res: { file: string; diffs: string[] }[] = [];
  for (const it of items.filter((i) => i.fixture)) {
    const ex = parseItem(readFileSync(join(REPO, "sources", SOURCE_DIR[it.source], "examples", it.fixture!), "utf8"));
    const diffs = deepDiff(it.item.payload, ex.payload, "payload");
    for (const f of ["effective", "effective_end", "patient", "issuer", "id", "recorded"] as const)
      if ((it.item as any)[f] !== ex.front[f]) diffs.push(`${f}: ${(it.item as any)[f]} != ${ex.front[f]}`);
    for (const f of ["supersedes", "retracts"] as const)
      if (JSON.stringify((it.item as any)[f] ?? []) !== JSON.stringify(ex.front[f] ?? [])) diffs.push(`${f}: ${JSON.stringify((it.item as any)[f])} != ${JSON.stringify(ex.front[f])}`);
    if (JSON.stringify(it.item.author ?? null) !== JSON.stringify(ex.front.author ?? null)) diffs.push(`author: ${JSON.stringify(it.item.author)} != ${JSON.stringify(ex.front.author)}`);
    if (it.item.narrative.trim() !== ex.narrative) diffs.push("narrative differs");
    res.push({ file: `${SOURCE_DIR[it.source]}/${it.fixture}`, diffs });
  }
  return res;
}

export function heroCtx() {
  return new Ctx(hero(), HERO_HINTS, "golden");
}
