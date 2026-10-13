# Planted traps

Each trap is something a mapper that only type-checks can get wrong. Every trap has a concrete instance
in the hero ([HERO.md](HERO.md)); the population generator plants each one in more patients so results
can be counted (target: each trap in at least 10% of the population, prose-only facts in ~15 patients).

The answer keys come from the clinical truth ([MODEL.md](MODEL.md)), never from a rendering, so each
check below compares a mapper's output against what actually happened.

Sources: A = Riverside Regional Hospital (encounter documents), B = Northgate Family Medicine (event
log), C = Lakeview Labs & Kidney Care (coded tables), P = HomeLog (patient app).

## Status and lifecycle

### T1. Held vs discontinued
- **Hero:** empagliflozin at discharge 2024-11-05 is `held` in A; B discontinues it 2024-11-12.
  Finerenone is `held` in C since 2026-09-14 and is meant to resume.
- **Appears as:** A: `status: "held"` plus prose "would not restart". B: event `med.stop` with
  `reason`. C: `MED_STATUS = 3` where the lookup table says 1 = active, 2 = discontinued, 3 = on hold,
  9 = entered in error.
- **Naive mapper:** treats `held` as stopped (finerenone vanishes from the list) or as active
  (empagliflozin looks current if A is the latest source read); reads C's integer as "active if
  nonzero".
- **Key catches it:** active-meds key carries a `status` per drug: finerenone = held; empagliflozin =
  stopped as of 2024-11-12.

### T2. Status lives on two axes (Epic-inspired: multi-axis status)
- **Hero:** C lab orders have `ORDER_STATUS` (ordered/collected/resulted/cancelled) and each result row
  has its own `RESULT_STATUS` (preliminary/final/corrected). The 2022-09-12 potassium order is
  "resulted" while its first result row is "corrected".
- **Naive mapper:** trusts the order status and keeps every result row.
- **Key catches it:** latest-labs and lab-series keys exclude corrected-away values.

### T3. Superseded / corrected results
- **Hero:** K 6.1 (hemolyzed) on 2022-09-12 replaced the same day by K 4.6. C marks the first row
  corrected with a pointer to the redraw; B's imported copy is later retracted with a FOLIO
  `supersedes` + `retracted`. Also 2026-09-14: K 5.8 then confirmed 5.7 on redraw — a *confirmation*,
  not a correction (both values valid).
- **Naive mapper:** reports hyperkalemia 6.1 in 2022, or drops the 2026 5.8 as if it were superseded.
- **Key catches it:** lab series for K; cohort "confirmed K ≥ 5.5" includes Linda only for 2026.

### T4. Soft delete / entered in error
- **Hero:** atorvastatin 80 mg entered on 2025-11-03 in B, voided the next day by a retraction event.
  In C, a duplicate A1c order on 2025-08-18 is kept as a row with `ORDER_STATUS = 9`
  (entered in error) rather than removed.
- **Naive mapper:** lists two atorvastatin strengths, or counts two A1c results.
- **Key catches it:** active meds contain only atorvastatin 40 mg; A1c series has one 2025-08-18 value.

### T5. Stale problem list
- **Hero:** B problem list says "CKD stage 3a" from 2022 until today; C's labs imply 3b from 2026-02 and
  C's nephrology visit records 3b on 2026-07-13.
- **Naive mapper:** reports stage 3a as current because B has the most problem entries.
- **Key catches it:** problem-list key has CKD 3b (A3) with source C, as of 2026-07-13. The key states
  that the problem list reflects the most specific *recorded* stage, not a lab-derived inference.

## Units and numbers

### T6. Glucose units shift mid-series
- **Hero:** HomeLog meter set to mmol/L until 2024-02-10, then mg/dL. Values like `7.8` then `141`.
- **Naive mapper:** plots 7.8 mg/dL (fatal hypoglycemia) or ignores the unit field.
- **Key catches it:** glucose series key is all mg/dL (7.8 mmol/L → 141 mg/dL, factor 18.016).

### T7. Platelets ×10³
- **Hero:** C stores `"212"` with unit code `K/uL`; B's import stores `212000` with `cells/uL`; A
  stores `212` labelled `10*3/uL`.
- **Naive mapper:** compares 212 to 212000 and calls one thrombocytopenic, or dedupes them as different.
- **Key catches it:** lab key normalized to 10³/µL; cohort "platelets ≥ 100" includes her.

### T8. Creatinine in SI units
- **Hero:** C's nephrology tables (the clinic uses European CKD software that stores SI units) hold
  creatinine in µmol/L (128 µmol/L = 1.45 mg/dL) while C's lab result rows use mg/dL.
- **Naive mapper:** reads 128 as mg/dL.
- **Key catches it:** latest creatinine 1.45 mg/dL; any eGFR recomputation must agree with 41.

### T9. Numbers stored as text, with operators and a sentinel (Epic-inspired: value cluster)
- **Hero:** C stores every result in `VALUE_TEXT` (text) and `VALUE_NUM` (numeric). For "> 60" the
  numeric column holds `9999999`, a sentinel for "read the text". Troponin "<0.01" in A is a string
  with an operator.
- **Naive mapper:** eGFR of 9,999,999 in 2021; sorts "9" above "41" as text; drops "<0.01".
- **Key catches it:** eGFR series key has `{ comparator: ">", value: 60 }` for 2021-01-14.

### T10. Date-only and time-zone shifts
- **Hero:** ED arrival 2024-11-01 21:40 local is `2024-11-02T03:40Z` in A. HomeLog stores local wall
  time with no offset. Problem onsets in B are year-only ("2016").
- **Naive mapper:** places the ED visit on Nov 2 and home readings 5–6 hours off; turns "2016" into
  2016-01-01 and computes a precise duration.
- **Key catches it:** encounter key keeps date 2024-11-01 local; onset key carries
  `precision: "year"`.

### T11. eGFR equation change
- **Hero:** until 2022-01-10, C reports two eGFR rows per creatinine (CKD-EPI 2009 "non-African
  American" 55 and "African American" 64, different local codes). From 2022-01-10, one row with CKD-EPI
  2021 race-free under a new local code.
- **Naive mapper:** takes the AA row (or the max) and shows a false decline 64 → 54 that is partly an equation artifact, or misses
  the series break by matching only one code.
- **Key catches it:** eGFR key is CKD-EPI 2021 recomputed from creatinine for the whole series
  (2021-09-20 → 58), with original reported values kept alongside. The decline-rate cohort uses the
  recomputed series.

## Meaning in prose

### T12. Negation and rule-outs
- **Hero:** A: "pancreatitis ruled out (lipase 28)", "no evidence of ACS". B 2021: "No lip, tongue or
  throat swelling" (cough only, not angioedema). A's ED diagnosis list includes "R/O pancreatitis" as a
  working diagnosis that is later ruled out.
- **Naive mapper / lexical search:** adds pancreatitis to problems; text search for "angioedema" puts
  her in an ACE-inhibitor angioedema cohort.
- **Key catches it:** problem key has no pancreatitis; angioedema cohort excludes her.

### T13. Prose-only facts
- **Hero:** DKA precipitant (gastroenteritis, poor intake) is only in A's H&P prose and P's notes;
  "kept taking empagliflozin while sick" is only in P; "sick day rules reviewed" only in a B note;
  the re-challenge decision only in C's note.
- **Naive mapper:** cannot know; structured-only cohort search misses them.
- **Key catches it:** cohort "SGLT2i-associated DKA with a documented precipitant" and the
  agent-to-agent intake answers. Scored separately from structured traps.

## Identity and duplication

### T14. Duplicates across sources
- **Hero:** every C result also appears in B as an imported copy with B's own item id; B keeps C's
  accession number in `external_ref`. Separately, home meds are re-listed in every A document (T15).
- **Naive mapper:** two A1c values per date; merged chart shows each lab twice; med list from A
  documents counted per document.
- **Key catches it:** each lab key entry lists its sources but appears once.

### T15. Per-document re-snapshot of the med list (Epic-inspired: per-encounter re-snapshot)
- **Hero:** each A document (ED note, H&P, 3 progress notes, discharge summary) re-lists all home meds
  with that document's status for each.
- **Naive mapper:** counts six sertraline "orders"; takes the first document's status instead of the
  latest.
- **Key catches it:** A's contribution to the med key is the discharge summary's list only.

### T16. Local codes without standard codes
- **Hero:** C's eGFR, UACR and K use local codes (`LK-EGFR21`, `LK-UACR`, `LK-K`) with LOINC present
  for only some; B uses RxNorm for most meds but its finerenone import from C has only a local drug id;
  A's "SGLT2i-associated euglycemic DKA" is ICD-10 E11.10 plus a local subtype code.
- **Naive mapper:** filters on LOINC only and misses half the eGFR series.
- **Key catches it:** eGFR series key has every value regardless of coding.

### T17. Fuzzy onset (Epic-inspired: accuracy-flagged dates)
- **Hero:** B's problem onsets carry `onset` + `onset_precision` ("year" | "month" | "day").
- See T10 for what goes wrong.

### T18. Same reaction, two shapes
- **Hero:** A records euglycemic DKA as an encounter diagnosis; B records "empagliflozin → euglycemic
  DKA" as an adverse reaction entry. Lisinopril cough is an intolerance, not an allergy.
- **Naive mapper:** allergy view lists "DKA" as an allergy; or omits the reaction because A had it as a
  diagnosis.
- **Key catches it:** allergy/intolerance key has two entries with `type` intolerance vs adverse
  reaction and criticality.

## Disclosure

### T19. Redaction hides a clinically relevant med
- **Hero:** with "hide mental health" chosen, sertraline (and the depression problem) are withheld from
  the nephrology referral. Sertraline is a plausible cause of her hyponatremia.
- **What goes wrong:** the receiving agent attributes low sodium to chlorthalidone alone.
- **How the demo catches it:** presentations mark that items were withheld; the receiving agent must
  ask; the answer key for the exchange expects the question to be asked.
