// Linda's items, read from the committed corpus and split into disclosure units the same way the
// signer does (itemToClaims), so the tests need no signing step.
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { itemToClaims, parseMarkdown } from "@folio/core";
import type { Part } from "../src/index.ts";

export const ROOT = resolve(import.meta.dir, "../../..");
const patients = JSON.parse(readFileSync(join(ROOT, "corpus/answers/patients.json"), "utf8")) as { patient: string; sources: Record<string, string> }[];
const hero = patients.find((p) => p.patient === "hero")!;

export const REFERRAL = [
  ["riverside", "2024-11-02-admission-hp.folio.md"],
  ["riverside", "2024-11-05-discharge-summary.folio.md"],
  ["northgate", "2024-11-12-visit-note.folio.md"],
  ["homelog", "2026-05-02-my-medicines.folio.md"],
  ["lakeview", "2026-07-13-new-visit.folio.md"],
] as const;

export function partsOf(source: string, file: string): Part[] {
  const item = parseMarkdown(readFileSync(join(ROOT, "corpus", source, hero.sources[source], file), "utf8"));
  const claims = itemToClaims(item);
  return Object.entries(claims.units).map(([id, u]) => ({
    item: `${source}/${file}`,
    source,
    id,
    hasEntry: "entry" in u,
    spanTexts: (u.spans ?? []).map((s) => s.text),
    entry: u.entry,
  }));
}

export const referralParts = () => REFERRAL.flatMap(([s, f]) => partsOf(s, f));

export function allHeroParts(): Part[] {
  const out: Part[] = [];
  for (const [source, local] of Object.entries(hero.sources))
    for (const f of readdirSync(join(ROOT, "corpus", source, local)).filter((f) => f.endsWith(".folio.md")).sort()) out.push(...partsOf(source, f));
  return out;
}
