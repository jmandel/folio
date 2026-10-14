// Secondary patients: hand-picked demographics and archetype combinations, each built to make one
// part of the story concrete next to the hero (a positive case where the hero is a negative one, or
// the reverse). They use the population generator's building blocks with fixed choices.

import type { Patient } from "./model.ts";
import { generatePatient } from "./population.ts";

export function secondaries(): Patient[] {
  return [
    // CKD progression on an SGLT2 inhibitor without DKA: in cohort 1 where the hero is not. Early
    // Lakeview labs give the ">60" and CKD-EPI 2009 race rows (T9, T11); his problem list lags (T5).
    generatePatient({ id: "s01", role: "secondary", seed: "secondary/marcus-bell", given: "Marcus", family: "Bell", sex: "M", birthDate: "1967-04-09",
      race: "Black or African American", arche: ["ckd_prog_sglt2", "early_labs", "hyperk_hem", "sick_day"], sources: ["B", "C"], bStart: "2019-05-13" }),
    // SGLT2i-associated euglycemic DKA after surgery, precipitant in the hospital's prose and her diary (cohort 2).
    generatePatient({ id: "s02", role: "secondary", seed: "secondary/rosa-delgado", given: "Rosa", family: "Delgado", sex: "F", birthDate: "1959-11-02",
      race: "Hispanic or Latino", arche: ["dka_prec", "meter_mmol", "acei_cough"], sources: ["A", "B", "C", "P"], bStart: "2020-02-18" }),
    // Heart failure on spironolactone and an ARB: a hemolyzed potassium that does not count and a
    // confirmed one that does (cohort 3), an AKI admission, and a held MRA (T1).
    generatePatient({ id: "s03", role: "secondary", seed: "secondary/walter-kim", given: "Walter", family: "Kim", sex: "M", birthDate: "1953-07-21",
      race: "Asian", arche: ["hf", "hyperk_hem", "hyperk_conf", "aki_hyperk", "med_error"], sources: ["A", "B", "C"], bStart: "2019-09-03" }),
    // Masked hypertension from her own cuff (cohort 5), typed duplicates and a typo fix in HomeLog,
    // depression on escitalopram (T19) and a true ACE-inhibitor angioedema (cohort 6).
    generatePatient({ id: "s04", role: "secondary", seed: "secondary/janet-morrow", given: "Janet", family: "Morrow", sex: "F", birthDate: "1972-01-30",
      race: "White", arche: ["masked_htn", "typed_dup", "mdd", "acei_angio", "otc_nsaid"], sources: ["A", "B", "P"], bStart: "2020-06-08" }),
  ];
}
