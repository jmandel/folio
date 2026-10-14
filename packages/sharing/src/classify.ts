// Assigning categories to disclosure units.
//
// A `CategorySource` looks at one unit and returns hits. The rule source below reads codes and
// names straight from the source-schema entry and the span text. A later source can read the
// sensitivity column of a compiled mapper's view rows instead (see `viewRowSource`); the policy
// code only sees hits, so either can be used, or both.

import type { CategoryId } from "./categories.ts";
import { FIELDS, MEDICINE_TYPES, RULES, type Rule } from "./rules.ts";

/** One disclosure unit, as a presenter sees it (matches @folio/core's UnitInfo plus where it is from). */
export interface Part {
  /** The item it belongs to (any stable key; the site uses `<source dir>/<item id>`). */
  item: string;
  /** Source directory: riverside, northgate, lakeview or homelog. */
  source: string;
  /** Unit id: the payload entry id, or the narrative-only span id. */
  id: string;
  hasEntry: boolean;
  spanTexts: string[];
  entry?: unknown;
}

export interface Hit {
  category: CategoryId;
  /** Rule id, or the name of the source that supplied the hit. */
  rule: string;
  basis: Rule["basis"];
  /** What matched: a code, a medicine name, a word. */
  matched: string;
  /** Where it matched, in plain words ("diagnosis code", "medicine name", "note text"). */
  where: string;
  because: string;
}

export interface CategorySource {
  name: string;
  classify(part: Part): Hit[];
}

export const partKey = (p: { item: string; id: string }) => `${p.item}#${p.id}`;

// ─── reading entries ───────────────────────────────────────────────────────────────────────────

interface Extracted {
  icd10: string[];
  rxnorm: string[];
  loinc: string[];
  names: string[];
  fields: Map<string, string[]>;
}

function extract(entry: unknown): Extracted {
  const out: Extracted = { icd10: [], rxnorm: [], loinc: [], names: [], fields: new Map() };
  const want = (list: readonly string[], k: string) => list.includes(k);
  const walk = (o: unknown) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" || typeof v === "number") {
        const s = String(v);
        if (want(FIELDS.icd10, k)) out.icd10.push(s);
        if (want(FIELDS.rxnorm, k)) out.rxnorm.push(s);
        if (want(FIELDS.loinc, k)) out.loinc.push(s);
        if (want(FIELDS.names, k)) out.names.push(s);
        out.fields.set(k, [...(out.fields.get(k) ?? []), s]);
      } else walk(v);
    }
  };
  walk(entry);
  return out;
}

export function isMedicineEntry(part: Part): boolean {
  const t = (part.entry as { type?: string } | undefined)?.type;
  return !!t && (MEDICINE_TYPES[part.source] ?? []).includes(t);
}

/** "F20-F48" covers F20…F48 by first three characters; anything else is a prefix. */
export function icdMatches(code: string, pattern: string): boolean {
  const c = code.toUpperCase().trim();
  const m = /^([A-Z]\d[\dA-Z])-([A-Z]\d[\dA-Z])$/.exec(pattern);
  if (m) {
    const head = c.slice(0, 3);
    return head >= m[1] && head <= m[2];
  }
  return c.startsWith(pattern.toUpperCase());
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Whole-word match for medicine names; word-start match for condition terms. */
export const wordRe = (w: string, whole: boolean) => new RegExp(`(^|[^\\p{L}\\p{N}])${escape(w)}${whole ? "(?![\\p{L}\\p{N}])" : ""}`, "iu");

// ─── the rule source ───────────────────────────────────────────────────────────────────────────

export const ruleSource: CategorySource = {
  name: "rules",
  classify(part) {
    const x = extract(part.entry);
    const text = part.spanTexts.join(" ");
    const hits: Hit[] = [];
    for (const r of RULES) {
      const add = (matched: string, where: string) => {
        if (!hits.some((h) => h.rule === r.id && h.matched.toLowerCase() === matched.toLowerCase()))
          hits.push({ category: r.category, rule: r.id, basis: r.basis, matched, where, because: r.because });
      };
      const m = r.match;
      if ("icd10" in m) for (const c of x.icd10) for (const p of m.icd10) if (icdMatches(c, p)) add(c, "diagnosis code");
      if ("rxnorm" in m) for (const c of x.rxnorm) if (m.rxnorm.includes(c)) add(c, "medicine code");
      if ("loinc" in m) for (const c of x.loinc) if (m.loinc.includes(c)) add(c, "test code");
      if ("medicines" in m)
        for (const w of m.medicines) {
          const re = wordRe(w, true);
          if (x.names.some((n) => re.test(n))) add(w, "medicine name");
          else if (re.test(text)) add(w, "note text");
        }
      if ("terms" in m)
        for (const w of m.terms) {
          const re = wordRe(w, false);
          if (x.names.some((n) => re.test(n))) add(w, "condition name");
          else if (re.test(text)) add(w, "note text");
        }
      if ("field" in m && (x.fields.get(m.field) ?? []).includes(m.equals)) add(`${m.field}: ${m.equals}`, "source flag");
    }
    return hits;
  },
};

/**
 * A source backed by compiled view rows. Each row names the item and unit it was mapped from and
 * the categories the mapper assigned (views v2 carries a sensitivity column for this).
 */
export function viewRowSource(
  rows: { item: string; unit: string; categories: CategoryId[]; basis?: Rule["basis"]; because?: string }[],
  name = "view rows",
): CategorySource {
  const byKey = new Map<string, typeof rows>();
  for (const r of rows) byKey.set(`${r.item}#${r.unit}`, [...(byKey.get(`${r.item}#${r.unit}`) ?? []), r]);
  return {
    name,
    classify(part) {
      return (byKey.get(partKey(part)) ?? []).flatMap((r) =>
        r.categories.map((category) => ({
          category,
          rule: name,
          basis: r.basis ?? "condition",
          matched: category,
          where: "compiled view",
          because: r.because ?? "The compiled view marks this row sensitive.",
        })),
      );
    },
  };
}

/** Hits from every source, in order, without duplicates. */
export function classify(part: Part, sources: CategorySource[] = [ruleSource]): Hit[] {
  const out: Hit[] = [];
  for (const s of sources) for (const h of s.classify(part)) if (!out.some((o) => o.rule === h.rule && o.matched === h.matched)) out.push(h);
  return out;
}

export { extract as extractCodes };
