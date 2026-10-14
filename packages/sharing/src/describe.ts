// Plain descriptions of what a policy does to the records being sent, built from the decisions.
//
// Nothing here is written per category or per preset: each sentence names the sensitive things
// actually found in these records ("your depression diagnosis", "sertraline") and where they are
// ("on three medicine lists and in one sentence of your July kidney-clinic note").

import { CATEGORIES, categoryById, type CategoryId } from "./categories.ts";
import { extractCodes, icdMatches, isMedicineEntry, wordRe } from "./classify.ts";
import type { Decision } from "./policy.ts";
import { PLAIN_NAMES } from "./rules.ts";

/** How to name one record in a sentence: "your November 2024 hospital admission note". */
export interface ItemName {
  name: string;
  /** The record is itself a medicine list ("your May HomeLog medicine list"). */
  medicineList?: boolean;
}

export interface Thing {
  id: string;
  /** "your depression diagnosis", "sertraline", or the quoted text of a part with no topic. */
  label: string;
  kind: "condition" | "medicine" | "part";
  category?: CategoryId;
}

/** One thing, and the parts about it that the policy shares (or withholds). */
export interface Mention {
  thing: Thing;
  share: boolean;
  decisions: Decision[];
  /** Where those parts are: "in your November 2024 hospital admission note". */
  where: string;
}

export interface ShareSummary {
  records: number;
  /** Things the clinic will not see, with where they are. */
  withheld: Mention[];
  /** Sensitive things the clinic will see. */
  shared: Mention[];
  /** Categories that occur in what is being sent, and those that do not. */
  present: CategoryId[];
  absent: CategoryId[];
  /** The whole description, for the patient. */
  text: string;
}

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const num = (n: number) => WORDS[n] ?? String(n);
export const andList = (xs: string[], conj = "and") =>
  xs.length <= 1 ? (xs[0] ?? "") : xs.length === 2 ? `${xs[0]} ${conj} ${xs[1]}` : `${xs.slice(0, -1).join(", ")}, ${conj} ${xs[xs.length - 1]}`;

/** The things one part is about. */
export function thingsOf(d: Decision, partLabel: (d: Decision) => string): Thing[] {
  if (!d.categories.length) return [{ id: `part:${d.key}`, label: `“${partLabel(d)}”`, kind: "part" }];
  const out: Thing[] = [];
  const add = (t: Thing) => out.some((o) => o.id === t.id) || out.push(t);
  const x = extractCodes(d.part.entry);
  const text = [...x.names, ...d.part.spanTexts];
  for (const c of d.categories) {
    const aboutCondition = d.hits.some((h) => h.category === c && h.basis !== "medicine");
    if (aboutCondition) {
      const named = PLAIN_NAMES.filter(
        (p) =>
          p.category === c &&
          (p.icd10?.some((pre) => x.icd10.some((code) => icdMatches(code, pre))) ||
            p.loinc?.some((l) => x.loinc.includes(l)) ||
            p.terms?.some((t) => text.some((s) => wordRe(t, false).test(s)))),
      );
      if (named.length) for (const p of named) add({ id: `cond:${p.label}`, label: p.label, kind: "condition", category: c });
      else add({ id: `cond:${c}`, label: `notes about your ${categoryById(c).about}`, kind: "condition", category: c });
    }
    const meds = d.hits.filter((h) => h.category === c && h.basis === "medicine" && h.where !== "medicine code").map((h) => h.matched.toLowerCase());
    if (!meds.length && d.hits.some((h) => h.category === c && h.basis === "medicine")) {
      const first = x.names[0]?.split(/\s+/)[0]?.toLowerCase();
      meds.push(first || `a ${categoryById(c).about} medicine`);
    }
    for (const m of meds) add({ id: `med:${m}`, label: m, kind: "medicine", category: c });
  }
  return out;
}

/** "on three medicine lists and in one sentence of your July kidney-clinic note". */
export function whereText(ds: Decision[], names: (item: string) => ItemName): string {
  const lists: string[] = [];
  const inItems: string[] = [];
  const sentences = new Map<string, number>();
  for (const d of ds) {
    const it = d.part.item;
    if (d.part.hasEntry && isMedicineEntry(d.part)) lists.includes(it) || lists.push(it);
    else if (d.part.hasEntry) inItems.includes(it) || inItems.push(it);
    else sentences.set(it, (sentences.get(it) ?? 0) + Math.max(1, d.part.spanTexts.length));
  }
  for (const it of inItems) sentences.delete(it);
  const bits: string[] = [];
  if (lists.length === 1) {
    const n = names(lists[0]);
    bits.push(n.medicineList ? `on ${n.name}` : `on the medicine list in ${n.name}`);
  } else if (lists.length > 1) bits.push(`on ${num(lists.length)} medicine lists`);
  for (const it of inItems) bits.push(`in ${names(it).name}`);
  for (const [it, n] of sentences) bits.push(`in ${n === 1 ? "one sentence" : `${num(n)} sentences`} of ${names(it).name}`);
  return andList(bits);
}

export interface DescribeOptions {
  /** How to name each record. */
  names: (item: string) => ItemName;
  /** Short text of a part, used only for parts withheld by a per-part choice that have no topic. */
  partLabel: (d: Decision) => string;
  /** Number of records being sent. */
  records: number;
}

const recordsText = (n: number) => (n === 1 ? "this record" : `these ${num(n)} records`);

export function describeShare(decisions: Decision[], o: DescribeOptions): ShareSummary {
  // Group parts by (thing, shared?), in order of first appearance.
  const groups = new Map<string, { thing: Thing; share: boolean; decisions: Decision[] }>();
  for (const d of decisions) {
    if (!d.categories.length && d.share) continue;
    for (const t of thingsOf(d, o.partLabel)) {
      const k = `${t.id}|${d.share}`;
      const g = groups.get(k) ?? { thing: t, share: d.share, decisions: [] };
      g.decisions.push(d);
      groups.set(k, g);
    }
  }
  const order = (m: Mention) => (m.thing.kind === "condition" ? 0 : m.thing.kind === "medicine" ? 1 : 2);
  const mentions = [...groups.values()].map((g) => ({ ...g, where: whereText(g.decisions, o.names) }));
  const withheld = mentions.filter((m) => !m.share).sort((a, b) => order(a) - order(b));
  const shared = mentions.filter((m) => m.share).sort((a, b) => order(a) - order(b));
  const present = CATEGORIES.map((c) => c.id).filter((id) => decisions.some((d) => d.categories.includes(id)));
  const absent = CATEGORIES.map((c) => c.id).filter((id) => !present.includes(id));

  const recs = recordsText(o.records);
  const withWhere = (m: Mention) => (m.where ? `${m.thing.label} (${m.where})` : m.thing.label);
  const sentences: string[] = [];
  if (!withheld.length) {
    const labels = [...new Set(shared.map((m) => m.thing.label))];
    sentences.push(labels.length ? `The clinic will see everything in ${recs}, including ${andList(labels)}.` : `The clinic will see everything in ${recs}.`);
  } else {
    sentences.push(`The clinic will not see ${andList(withheld.map(withWhere))}.`);
    sentences.push(shared.length ? `It will see ${andList(shared.map(withWhere))}, and everything else in ${recs}.` : `It will see everything else in ${recs}.`);
    // A medicine shared while its topic is private: say what the name can reveal.
    const listed = [...new Set(shared.filter((m) => m.thing.kind === "medicine" && m.decisions.some((d) => d.via === "medicine")).map((m) => m.thing.label))];
    if (listed.length)
      sentences.push(
        listed.length === 1
          ? `Doctors know what ${listed[0]} is usually taken for, so the clinic may guess why you take it.`
          : `Doctors know what ${andList(listed)} are usually taken for, so the clinic may guess why you take them.`,
      );
  }
  return { records: o.records, withheld, shared, present, absent, text: sentences.join(" ") };
}

/**
 * For one present category: the things in it, split by whether the clinic will see them. A thing
 * that is partly shared is named with where, on both sides ("sertraline (on three medicine lists)").
 */
export function topicState(s: ShareSummary, c: CategoryId): { seen: string[]; hidden: string[] } {
  const inCat = (ms: Mention[]) => ms.filter((m) => m.thing.category === c);
  const both = new Set(inCat(s.shared).filter((m) => inCat(s.withheld).some((w) => w.thing.id === m.thing.id)).map((m) => m.thing.id));
  const of = (ms: Mention[]) => [...new Set(inCat(ms).map((m) => (both.has(m.thing.id) && m.where ? `${m.thing.label} (${m.where})` : m.thing.label)))];
  return { seen: of(s.shared), hidden: of(s.withheld) };
}

/** "These records contain nothing about alcohol or drug use, … or genetic tests." Empty when every category occurs. */
export function absentText(s: ShareSummary): string {
  if (!s.absent.length) return "";
  return `${s.records === 1 ? "This record contains" : "These records contain"} nothing about ${andList(s.absent.map((c) => categoryById(c).about), "or")}.`;
}
