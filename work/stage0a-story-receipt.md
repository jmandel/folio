# Stage 0a receipt — story, traps, truth model

Produced: `truth/HERO.md`, `truth/TRAPS.md`, `truth/MODEL.md` (includes cohort candidates). Not committed.

## Choices made

- **Hero:** Linda Okafor, 61F, Black (needed for the eGFR race-coefficient trap, T11), America/Chicago.
- **Sources:** A Riverside Regional Hospital (encounter documents), B Northgate Family Medicine (event
  log), C Lakeview Labs & Kidney Care (outreach lab + nephrology, coded tables), P HomeLog (patient app).
  C being both the lab and the referral target means nephrology already holds her labs but not her meds
  or history — a good reason for the intake exchange.
- **Subplot:** both adverse events, at different weights. Main: empagliflozin → euglycemic DKA (2024),
  driving the re-challenge question at nephrology referral (2026). Minor: lisinopril cough (2021) for
  intolerance-vs-allergy and the "no angioedema" negation.
- **Redaction:** depression + sertraline hidden under "hide mental health"; sertraline is a plausible
  cause of her hyponatremia (Na 129–133), so the receiving agent must ask about withheld meds (T19).
- **Traps:** 19 (T1–T19). Epic-inspired ones: multi-axis status (T2), numeric sentinel 9999999 + text
  value (T9), per-document med re-snapshot (T15), accuracy-flagged onset dates (T17).
- **eGFR numbers** were computed from the CKD-EPI equations for her creatinine/age, so the generator can
  recompute them.
- **Cohorts:** 5 candidates in `MODEL.md`, each tagged with the traps it exercises; a 6th (ACEi angioedema)
  as a lexical-false-positive case.

## Open questions for the orchestrator

1. T8 (creatinine in µmol/L inside a US nephrology clinic's tables) is a stretch; keep it, or move SI units
   to a different plausible place (e.g. an outside record from Canada)?
2. Answer-key policy for the problem list: "most specific *recorded* stage" (T5) — or should the key also
   accept a lab-inferred stage? Affects how we score B's stale "3a".
3. Should P (HomeLog) records be signed by the patient's own did, and does B re-sign imported C results
   (affects T14 and the provenance story)?
4. Cohort 5 (masked hypertension) needs the generator to decide Linda's home vs clinic BP outcome.
5. Population: each trap in ≥10% of ~300 patients, prose-only facts in ~15 — confirm target sizes.
