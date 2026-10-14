export * from "./model.ts";
export { hero } from "./hero.ts";
export { secondaries } from "./secondaries.ts";
export { generatePopulation, generatePatient, assignArchetypes, QUOTAS, type Archetype } from "./population.ts";

import { hero } from "./hero.ts";
import { type Patient, sortKey } from "./model.ts";
import { drug, DRUGS } from "./catalog.ts";
import { generatePopulation } from "./population.ts";
import { secondaries } from "./secondaries.ts";

export const DEFAULT_SEED = "folio-stage1";
export const POPULATION_SIZE = 295;

/** The whole truth: hero, secondaries, and the seeded population (~300 patients). */
export function buildTruth(seed = DEFAULT_SEED, populationSize = POPULATION_SIZE, idPrefix = "p", opts: { anchors?: boolean } = {}): Patient[] {
  const ps = [...(opts.anchors === false ? [] : [hero(), ...secondaries()]), ...generatePopulation(seed, populationSize, idPrefix)];
  const bad = ps.flatMap((p) => plausibility(p).map((x) => `${p.id}: ${x}`));
  if (bad.length && !process.env.FOLIO_NO_PLAUSIBILITY) throw new Error(`implausible truth:\n${bad.join("\n")}`);
  return ps;
}

/**
 * Plausibility rules the generator must keep (checked on every build):
 * - no two outpatient lines of the same ingredient are active at the same time;
 * - no outpatient medicine is started after an adverse-reaction or allergy entry for the same ingredient, or after an
 *   adverse-reaction entry for a drug of the same class (e.g. no SGLT2i restart after SGLT2i-associated DKA).
 */
export function plausibility(p: Patient): string[] {
  const out: string[] = [];
  const meds = p.meds.filter((m) => m.setting !== "inpatient");
  const spans = meds.map((m) => {
    const segs: [number, number][] = [];
    let start: number | undefined;
    for (const h of m.history) {
      const t = sortKey(h.at);
      if ((h.status === "active" || h.status === "held") && start === undefined) start = t;
      if ((h.status === "stopped" || h.status === "entered-in-error") && start !== undefined) { segs.push([start, t]); start = undefined; }
      if (h.status === "entered-in-error") segs.length = 0;
    }
    if (start !== undefined && !m.history.some((h) => h.status === "entered-in-error")) segs.push([start, Infinity]);
    return { m, ing: drug(m.product).ingredient, klass: drug(m.product).klass, segs };
  });
  for (let i = 0; i < spans.length; i++) for (let j = i + 1; j < spans.length; j++) {
    const a = spans[i], b = spans[j];
    if (a.ing !== b.ing) continue;
    if (a.segs.some(([s1, e1]) => b.segs.some(([s2, e2]) => s1 < e2 && s2 < e1))) out.push(`two active ${a.ing} lines (${a.m.id}, ${b.m.id})`);
  }
  for (const al of p.allergies) {
    const t = sortKey(al.recordedAt);
    const alDrug = Object.values(DRUGS).find((d) => d.ingredientRx === al.substance.code);
    for (const x of spans) {
      const same = x.ing === al.substance.display || (al.type === "adverse-reaction" && alDrug && alDrug.klass === x.klass);
      if (same && x.m.history.some((h) => sortKey(h.at) > t && h.status === "active" && h.by !== "P")) out.push(`${x.m.id} ${x.ing} re-activated after ${al.type} to ${al.substance.display}`);
      const first = x.m.history[0];
      if (sortKey(first.at) <= t) continue;
      if (x.ing === al.substance.display || (al.type === "adverse-reaction" && alDrug && alDrug.klass === x.klass)) out.push(`${x.m.id} ${x.ing} started after ${al.type} to ${al.substance.display}`);
    }
  }
  return out;
}
