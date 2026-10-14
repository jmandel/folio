// From a policy to a decision per disclosure unit, and from decisions to suggested refinements.
// Everything here is deterministic: the same parts and policy always give the same decisions.

import { CATEGORIES, categoryById, type CategoryId, type Policy } from "./categories.ts";
import { classify, extractCodes, icdMatches, isMedicineEntry, partKey, ruleSource, wordRe, type CategorySource, type Hit, type Part } from "./classify.ts";
import { CONTEXT_RULES, type ContextRule } from "./rules.ts";

export interface Decision {
  part: Part;
  key: string;
  share: boolean;
  hits: Hit[];
  /** Categories this part falls in. */
  categories: CategoryId[];
  /** True when the part is a medicine and nothing ties it to a condition (only medicine names, codes or flags matched). */
  medicineOnly: boolean;
  /** Why it is shared or withheld, in plain words. */
  reason: string;
  via: "default" | "private" | "medicine" | "override";
}

/** A part counts as "only a medicine" if it is a medicine entry or a narrative span, and no hit is a condition or test. */
function medicineOnly(part: Part, hits: Hit[]): boolean {
  if (!hits.length || hits.some((h) => h.basis === "condition" || h.basis === "test")) return false;
  if (part.hasEntry) return isMedicineEntry(part);
  return hits.every((h) => h.basis === "medicine");
}

export function decide(parts: Part[], policy: Policy, sources: CategorySource[] = [ruleSource]): Decision[] {
  return parts.map((part) => {
    const key = partKey(part);
    const hits = classify(part, sources);
    const categories = CATEGORIES.map((c) => c.id).filter((id) => hits.some((h) => h.category === id));
    const medOnly = medicineOnly(part, hits);
    const priv = categories.filter((c) => policy.private.includes(c));
    const names = priv.map((c) => categoryById(c).label.toLowerCase()).join(" and ");
    let d: Pick<Decision, "share" | "reason" | "via">;
    if (priv.length === 0) d = { share: true, reason: categories.length ? "Its topic is not marked private." : "It is not about a private topic.", via: "default" };
    else if (policy.shareMedicines && medOnly) d = { share: true, reason: `It is a medicine (${names}), and you chose to list all your medicines.`, via: "medicine" };
    else d = { share: false, reason: `It is about ${names}, which you keep private.`, via: "private" };
    const o = policy.overrides[key];
    if (o) d = { share: o === "share", reason: o === "share" ? "You chose to share this part." : "You chose to keep this part private.", via: "override" };
    return { part, key, hits, categories, medicineOnly: medOnly, ...d };
  });
}

// ─── suggested refinements ─────────────────────────────────────────────────────────────────────

export interface Suggestion {
  id: string;
  rule: ContextRule;
  /** Withheld parts that name the medicine. */
  hidden: Decision[];
  /** Shared parts that show the finding. */
  evidence: Decision[];
  /** The medicine names found in the withheld parts. */
  medicines: string[];
  /** Apply this to the policy to take the suggestion. */
  patch: Partial<Policy>;
}

function mentions(d: Decision, names: string[]): string[] {
  const x = extractCodes(d.part.entry);
  const hay = [...x.names, ...d.part.spanTexts];
  return names.filter((n) => hay.some((s) => wordRe(n, true).test(s)));
}

function shows(d: Decision, s: ContextRule["shows"]): boolean {
  const x = extractCodes(d.part.entry);
  if (s.icd10?.some((p) => x.icd10.some((c) => icdMatches(c, p)))) return true;
  const text = [...x.names, ...d.part.spanTexts];
  if (s.terms?.some((t) => text.some((h) => wordRe(t, false).test(h)))) return true;
  const results = resultValues(d.part.entry);
  if (s.loincBelow?.some((r) => results.some((v) => v.loinc === r.loinc && v.value < r.below))) return true;
  if (s.loincAbove?.some((r) => results.some((v) => v.loinc === r.loinc && v.value > r.above))) return true;
  return false;
}

/** Numeric results with a LOINC code, from any of the source shapes (value / VALUE_TEXT / VALUE_NUM beside a loinc). */
function resultValues(entry: unknown): { loinc: string; value: number }[] {
  const out: { loinc: string; value: number }[] = [];
  const walk = (o: any) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== "object") return;
    const loinc = o.loinc ?? o.LOINC ?? o.test?.loinc ?? o.test?.LOINC;
    const raw = o.value ?? o.VALUE_NUM ?? o.VALUE_TEXT;
    const value = typeof raw === "number" ? raw : typeof raw === "string" && /^\s*\d+(\.\d+)?\s*$/.test(raw) ? +raw : NaN;
    if (typeof loinc === "string" && !Number.isNaN(value)) out.push({ loinc, value });
    for (const v of Object.values(o)) if (v && typeof v === "object") walk(v);
  };
  walk(entry);
  return out;
}

/**
 * Suggestions arise when the policy hides a medicine that may explain something the clinic will
 * see. Each suggests listing medicines while keeping the rest of the topic private.
 */
export function suggestions(decisions: Decision[], policy: Policy): Suggestion[] {
  if (policy.shareMedicines) return [];
  const out: Suggestion[] = [];
  for (const rule of CONTEXT_RULES) {
    // Only parts the policy (not a per-part choice) withholds, and only ones the medicine switch would share.
    const hidden = decisions.filter((d) => !d.share && d.via === "private" && d.medicineOnly && mentions(d, rule.medicines).length);
    if (!hidden.length) continue;
    const evidence = decisions.filter((d) => d.share && shows(d, rule.shows));
    if (!evidence.length) continue;
    const medicines = [...new Set(hidden.flatMap((d) => mentions(d, rule.medicines)))];
    out.push({ id: rule.id, rule, hidden, evidence, medicines, patch: { shareMedicines: true } });
  }
  return out;
}

export function applyPatch(p: Policy, patch: Partial<Policy>): Policy {
  return { ...p, ...patch, overrides: { ...p.overrides, ...(patch.overrides ?? {}) } };
}
