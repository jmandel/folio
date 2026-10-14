// Guards for note requests: what a note must not say (facts its author cannot know yet, facts that
// live only in other sources) and which sensitive words must stay inside their own spans.

import { drug } from "../../truth/src/catalog.ts";
import { localDate, type Patient, type SourceKey, sortKey } from "../../truth/src/model.ts";
import type { NoteRequest } from "./context.ts";

const BH_CONDITION = "depress|\\bMDD\\b|F33";

export function medPattern(p: Patient, medId: string): string {
  const m = p.meds.find((x) => x.id === medId)!;
  const names = new Set<string>();
  for (const prod of [m.product, ...m.history.map((h) => h.product).filter(Boolean)] as string[]) {
    const d = drug(prod);
    names.add(d.ingredient.split(" ").slice(-1)[0] === "glargine" ? "glargine" : d.ingredient.split(" ")[0]);
    if (d.brand) names.add(d.brand);
  }
  if (m.otc && drug(m.product).klass === "nsaid") names.add("NSAID");
  return `\\b(${[...names].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`;
}

/**
 * @param spanOf factId -> span id in this note (for sensitive facts the note may mention, inside that span)
 */
export function guards(p: Patient, source: SourceKey, when: string, factIds: string[], spanOf: Record<string, string>): Pick<NoteRequest, "forbidden" | "sensitive"> {
  const forbidden: NoteRequest["forbidden"] = [];
  const sensitive: NoteRequest["sensitive"] = [];
  const inNote = new Set(factIds);
  const t = sortKey(when);

  // Sensitive facts: inside their own span, or not at all.
  const bh = new Set(p.sensitivity.flatMap((s) => s.factIds));
  for (const id of bh) {
    const med = p.meds.find((m) => m.id === id);
    const cond = p.conditions.find((c) => c.id === id);
    const pattern = med ? medPattern(p, id) : cond ? BH_CONDITION : undefined;
    if (!pattern) continue;
    if (inNote.has(id) && spanOf[id]) sensitive.push({ pattern, allowedIn: [...new Set([spanOf[id], ...relatedSpans(p, id, spanOf)])] });
    else forbidden.push({ statement: `${id} is sensitive and has no span of its own in this note`, pattern });
  }

  // Medications the patient had not started by this time, or that this source cannot know.
  for (const m of p.meds) {
    if (inNote.has(m.id) || bh.has(m.id) || m.setting === "inpatient") continue;
    const first = m.history[0];
    const others = p.meds.filter((x) => x.id !== m.id && medPattern(p, x.id) === medPattern(p, m.id) && sortKey(x.history[0].at) <= t);
    if (others.length) continue;
    const notYet = sortKey(first.at) > t;
    const invisible = !m.visibility[source];
    if (notYet || invisible) forbidden.push({ statement: `${drug(m.product).ingredient}: ${notYet ? "not started by " + localDate(when) : "unknown to this source"}`, pattern: medPattern(p, m.id) });
  }
  // Prose-only facts that live in other sources (e.g. the DKA precipitant is not Northgate's to write).
  for (const f of p.narrativeFacts) {
    if (inNote.has(f.id) || f.visibility[source] || f.kind !== "precipitant") continue;
    forbidden.push({ statement: `${f.id} is not recorded by this source`, pattern: "gastroenteritis|stomach bug|stomach flu" });
  }
  return { forbidden: dedupe(forbidden), sensitive };
}

function relatedSpans(p: Patient, id: string, spanOf: Record<string, string>): string[] {
  // A sensitive narrative fact about a sensitive med may carry the med's name in its own span.
  return p.narrativeFacts.filter((f) => f.about?.includes(id) && spanOf[f.id]).map((f) => spanOf[f.id]);
}

function dedupe<T extends { pattern: string }>(xs: T[]): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => (seen.has(x.pattern) ? false : (seen.add(x.pattern), true)));
}
