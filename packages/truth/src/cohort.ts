// Which corpus a process works on. FOLIO_COHORT=fresh selects the round-3 held-out cohort: generated with new seeds
// after the key and scorer code were frozen, trap-targeted quotas, ids f001…, written to corpus-fresh/. Nothing in
// it was looked at for triage.
import type { Archetype } from "./population.ts";

export const COHORT = (process.env.FOLIO_COHORT ?? "main") as "main" | "fresh";
export const corpusDir = () => (COHORT === "fresh" ? "corpus-fresh" : "corpus");

/** Fresh cohort: rare judgment traps boosted so each reaches >= 10 patients per source where the generator allows. */
export const FRESH = {
  seed: "folio-stage3-fresh-final",
  size: 180,
  idPrefix: "f",
  quotas: {
    ckd_prog_sglt2: 10, ckd_prog_sglt2_held: 14, ckd_inpatient_dip: 10, dka_prec: 36, dka_noprec: 12, hyperk_conf: 26, hyperk_hem: 24,
    insulin_ckd: 10, masked_htn: 10, acei_angio: 18, acei_cough: 22, med_error: 22, dup_lab: 22, meter_mmol: 24, mdd: 60, hf: 24,
    b_hold: 26, sick_day: 14, nonadherence: 10, otc_nsaid: 24, chest_pain: 24, pneumonia: 12, aki_hyperk: 16, early_labs: 40, typed_dup: 30,
  } as Record<Archetype, number>,
};
