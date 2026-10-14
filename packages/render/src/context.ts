// Shared rendering context: native-id allocation (pinned for the hero, generated otherwise),
// rendered-item and note-request types, and small formatting helpers.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Patient, SourceKey, TrapId } from "../../truth/src/model.ts";
import { Rng } from "../../truth/src/rng.ts";
import { type Item, parseItem, REPO, type SourceDir } from "./item.ts";

export const SOURCE_DIR: Record<SourceKey, SourceDir> = { A: "riverside", B: "northgate", C: "lakeview", P: "homelog" };
export const ISSUER: Record<SourceKey, string> = {
  A: "did:web:riverside-regional.example",
  B: "did:web:northgate-fm.example",
  C: "did:web:lakeview-labs.example",
  P: "did:web:homelog.example",
};

/** What the prose step must write for one item. Produced by the renderers, consumed by packages/render/src/prose.ts. */
export interface NoteRequest {
  key: string;
  source: SourceKey;
  docKind: string;
  when: string;                                // local date/time, human-readable
  author?: string;
  mode: "markdown";
  /** Payload entries to wrap in a <ref> span, each exactly once. */
  refs: { id: string; about: string }[];
  /** Narrative-only spans (no payload entry), each exactly once; the span text must carry the statement. */
  spans: { id: string; statement: string; evidence: string[][] }[];
  /** Prose-only facts and negations the text must state (anywhere). */
  mustInclude: { statement: string; evidence: string[][] }[];
  /** Other facts the author knows and may use. */
  context: string[];
  /** Facts this author cannot know or must not write; a match fails validation. */
  forbidden: { statement: string; pattern: string }[];
  /** Words that may appear only inside the listed spans (disclosure boundaries, spec/record-item.md). */
  sensitive: { pattern: string; allowedIn: string[] }[];
  length: string;
  style: string;                               // key into STYLE_GUIDES (prose.ts)
  /** Exact layout the narrative must follow; each "[...]" is free text the writer supplies. */
  skeleton?: string;
  /** What the words should say, when the truth already has the gist (patient diary notes). */
  gist?: string[];
}

export interface RenderedItem {
  source: SourceKey;
  dir: SourceDir;
  key: string;                                 // stable within (patient, source)
  file: string;                                // file name, unique within (patient, source)
  item: Item;
  narrativeKind: "none" | "fixture" | "app" | "prose";
  note?: NoteRequest;
  /** Reuse another item's narrative (a superseding page restates the same diary text). */
  narrativeFrom?: string;
  /** Deterministic placeholder narrative used until prose exists. */
  template?: string;
  facts: string[];
  traps: TrapId[];
  fixture?: string;                            // sources/<dir>/examples/<file> this item reproduces
}

export interface Hints {
  /** item key -> example file (relative to sources/<dir>/examples) that fixes id, recorded and narrative. */
  examples: Partial<Record<SourceKey, Record<string, string>>>;
  /** item key -> ULID, for items referenced by examples but not themselves examples. */
  itemIds: Record<string, string>;
  /** "<source>:<kind>:<key>" -> source-native id. */
  ids: Record<string, string>;
  /** Entry-key overrides, "<source>:<factId>" -> key. */
  keys: Record<string, string>;
}

export const NO_HINTS: Hints = { examples: {}, itemIds: {}, ids: {}, keys: {} };

export class Ctx {
  readonly rng: Rng;
  private used = new Set<string>();
  private memo = new Map<string, string>();
  constructor(readonly p: Patient, readonly hints: Hints, seed: string) {
    this.rng = new Rng(`${seed}/render/${p.id}`);
  }
  get tz() {
    return this.p.demographics.tz;
  }
  /** A source-native id: pinned by hints, else generated (stable per kind+key). */
  id(source: SourceKey, kind: string, key: string, gen: (r: Rng) => string): string {
    const k = `${source}:${kind}:${key}`;
    const pinned = this.hints.ids[k];
    if (pinned) return pinned;
    const hit = this.memo.get(k);
    if (hit) return hit;
    const r = this.rng.fork(k);
    for (let i = 0; i < 50; i++) {
      const v = gen(r);
      if (!this.used.has(`${kind}:${v}`) && !Object.values(this.hints.ids).includes(v)) {
        this.used.add(`${kind}:${v}`);
        this.memo.set(k, v);
        return v;
      }
    }
    throw new Error(`id space exhausted for ${k}`);
  }
  key(source: SourceKey, factId: string, dflt: string): string {
    return this.hints.keys[`${source}:${factId}`] ?? dflt;
  }
  example(source: SourceKey, itemKey: string): { file: string; id: string; recorded: string; narrative: string; payload: Record<string, any> } | undefined {
    const f = this.hints.examples[source]?.[itemKey];
    if (!f) return undefined;
    const path = join(REPO, "sources", SOURCE_DIR[source], "examples", f);
    const parsed = parseItem(readFileSync(path, "utf8"));
    return { file: f, id: parsed.front.id as string, recorded: parsed.front.recorded as string, narrative: parsed.narrative, payload: parsed.payload };
  }
}

// ─── helpers ────────────────────────────────────────────────────────────────────────────────────

export function fmtNum(v: number, decimals: number): string {
  return v.toFixed(decimals);
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Ensure file names are unique within a (patient, source) directory. */
export function uniqueFiles(items: RenderedItem[]): void {
  const seen = new Map<string, number>();
  for (const it of items) {
    const base = it.file.replace(/\.folio\.md$/, "");
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    if (n > 1) it.file = `${base}-${n}.folio.md`;
  }
}

export function personName(p: Patient): string {
  return `${p.demographics.given} ${p.demographics.family}`;
}

const ICD10_DISPLAY: Record<string, string> = {
  I10: "Essential (primary) hypertension",
  "E11.9": "Type 2 diabetes mellitus without complications",
  "E11.22": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
  "E11.65": "Type 2 diabetes mellitus with hyperglycemia",
  "E11.10": "Type 2 diabetes mellitus with ketoacidosis without coma",
  "N18.2": "Chronic kidney disease, stage 2 (mild)",
  "N18.31": "Chronic kidney disease, stage 3a",
  "N18.32": "Chronic kidney disease, stage 3b",
  "N18.4": "Chronic kidney disease, stage 4 (severe)",
  "E78.5": "Hyperlipidemia, unspecified",
  "F33.0": "Major depressive disorder, recurrent, mild",
  "F41.1": "Generalized anxiety disorder",
  "E66.9": "Obesity, unspecified",
  "I50.22": "Chronic systolic (congestive) heart failure",
  "M10.9": "Gout, unspecified",
  "M17.9": "Osteoarthritis of knee, unspecified",
  "E03.9": "Hypothyroidism, unspecified",
  "E87.1": "Hypo-osmolality and hyponatremia",
  "E87.5": "Hyperkalemia",
  "N17.9": "Acute kidney failure, unspecified",
  "I12.9": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
  "Z86.39": "Personal history of other endocrine, nutritional and metabolic disease",
  Z09: "Follow-up exam after completed treatment",
  "Z00.00": "Encounter for general adult medical examination without abnormal findings",
  "K85.90": "Acute pancreatitis without necrosis or infection, unspecified",
  "J18.9": "Pneumonia, unspecified organism",
  "T78.3XXA": "Angioneurotic edema, initial encounter",
  "I24.9": "Acute ischemic heart disease, unspecified",
};

export function icdDisplay(code: string): string {
  return ICD10_DISPLAY[code] ?? code;
}

const ICD_SLUG: [RegExp, string][] = [
  [/^E11\.10/, "dka"], [/^K85/, "pancreatitis"], [/^E87\.1/, "na"], [/^E87\.5/, "hyperk"], [/^N17/, "aki"], [/^J18/, "pneumonia"],
  [/^I24/, "acs"], [/^T78\.3/, "angioedema"], [/^I50/, "hf"], [/^I1[02]/, "htn"], [/^E11/, "dm"], [/^E78/, "lipid"], [/^F3[23]/, "mdd"],
  [/^N18/, "ckd"], [/^E66/, "obesity"], [/^M17/, "oa"], [/^E03/, "thyroid"], [/^F41/, "anxiety"], [/^M10/, "gout"],
];

/** Readable slug for entry keys: hand-made ids keep their name (c_dka -> dka); generated ids use the condition or drug. */
export function factSlug(p: Patient, id: string): string {
  if (!/^[a-z]+_\d+$/.test(id)) return id.replace(/^[a-z]+_/, "");
  const c = p.conditions.find((x) => x.id === id);
  if (c) {
    const icd = c.coding.find((x) => x.system === "icd10")!.code;
    return ICD_SLUG.find(([re]) => re.test(icd))?.[1] ?? id.replace(/^[a-z]+_/, "");
  }
  const m = p.meds.find((x) => x.id === id);
  if (m) return m.product.replace(/^fluid-/, "").replace(/-[\d.]+$/, "").replace(/^regular-insulin$/, "insulin").replace(/-iv$/, "").replace(/-/g, "_");
  return id.replace(/^[a-z]+_/, "");
}
