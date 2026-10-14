export * from "./model.ts";
export { hero } from "./hero.ts";
export { secondaries } from "./secondaries.ts";
export { generatePopulation, generatePatient, assignArchetypes, QUOTAS, type Archetype } from "./population.ts";

import { hero } from "./hero.ts";
import type { Patient } from "./model.ts";
import { generatePopulation } from "./population.ts";
import { secondaries } from "./secondaries.ts";

export const DEFAULT_SEED = "folio-stage1";
export const POPULATION_SIZE = 295;

/** The whole truth: hero, secondaries, and the seeded population (~300 patients). */
export function buildTruth(seed = DEFAULT_SEED, populationSize = POPULATION_SIZE): Patient[] {
  return [hero(), ...secondaries(), ...generatePopulation(seed, populationSize)];
}
