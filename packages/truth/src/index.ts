export * from "./model.ts";
export { hero } from "./hero.ts";
export { secondaries } from "./secondaries.ts";
export { generatePopulation, generatePatient, assignArchetypes, QUOTAS, type Archetype } from "./population.ts";

import { hero } from "./hero.ts";
import type { Archetype } from "./population.ts";
import { COHORT, FRESH } from "./cohort.ts";
export { COHORT, corpusDir, FRESH } from "./cohort.ts";

/** The truth of the selected cohort (FOLIO_COHORT). */
export function buildCohort(): Patient[] {
  return COHORT === "fresh" ? buildTruth(FRESH.seed, FRESH.size, FRESH.idPrefix, { anchors: false, quotas: FRESH.quotas }) : buildTruth();
}
import type { Patient } from "./model.ts";
import { plausibility } from "./plausibility.ts";
export { plausibility };
import { generatePopulation } from "./population.ts";
import { secondaries } from "./secondaries.ts";

export const DEFAULT_SEED = "folio-stage1";
export const POPULATION_SIZE = 295;

/** The whole truth: hero, secondaries, and the seeded population (~300 patients). */
export function buildTruth(seed = DEFAULT_SEED, populationSize = POPULATION_SIZE, idPrefix = "p", opts: { anchors?: boolean; quotas?: Record<Archetype, number> } = {}): Patient[] {
  const ps = [...(opts.anchors === false ? [] : [hero(), ...secondaries()]), ...generatePopulation(seed, populationSize, idPrefix, 1, opts.quotas)];
  const bad = ps.flatMap((p) => plausibility(p).map((x) => `${p.id}: ${x}`));
  if (bad.length && !process.env.FOLIO_NO_PLAUSIBILITY) throw new Error(`implausible truth:\n${bad.join("\n")}`);
  return ps;
}

