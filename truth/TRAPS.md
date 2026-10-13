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
- **Appears as:** A: `status: "held"` plus prose "would not restart". B: `med_event` with
  `action: "stop"` and `stop_reason`. C: a `MED_STATUS_HIST` row with `NEW_STATUS = 3` (1 = active,
  2 = discontinued, 3 = on hold, 9 = entered in error) while the original `MED_ORDER` row, in an earlier
  item that is not superseded, still says 1. B also carries finerenone as an `origin: "outside"` line
  added at a 2026-07-20 reconciliation and never updated, so B's replayed list shows it active.
- **Naive mapper:** treats `held` as stopped (finerenone vanishes from the list) or as active
  (empagliflozin looks current if A is the latest source read); reads C's `MED_ORDER` row without the
  history rows, or reads C's integer as "active if nonzero"; trusts B's stale outside line.
- **Key catches it:** active-meds key carries a `status` per drug: finerenone = held; empagliflozin =
  stopped as of 2024-11-12.

### T2. Status lives on two axes (Epic-inspired: multi-axis status)
- **Hero:** C lab orders have an integer `ORDER_STATUS` (1 ordered … 4 resulted, 5 cancelled,
  9 entered in error) and each result row has its own letter `RESULT_STATUS` (P/F/A/C/X, where 'C'
  means withdrawn). The 2022-09-12 potassium order is 4 (resulted) while its only result row is 'C'.
- **Naive mapper:** trusts the order status and keeps every result row.
- **Key catches it:** latest-labs and lab-series keys exclude corrected-away values.

### T3. Superseded / corrected results
- **Hero:** K 6.1 (hemolyzed) on 2022-09-12 replaced the same day by K 4.6 from a redraw. C publishes
  an item that `supersedes` its first requisition item and restates the 6.1 row as withdrawn ('C') with
  a pointer to the redraw result; the redraw is its own requisition item. B's imported 6.1 copy is
  likewise superseded by a corrected copy (`result_status` 'C', "Result invalidated"). Both originals
  stay in the history view. Also 2026-09-14: K 5.8 then confirmed 5.7 on redraw — a *confirmation*,
  not a correction (both values valid).
- **Naive mapper:** reports hyperkalemia 6.1 in 2022 (reads superseded items, or ignores C's 'C'
  status), or drops the 2026 5.8 as if it were superseded.
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
- **Hero:** 2025-08-18: C stores `"212"` with unit code `K/uL`; B's import stores `"212000"` with
  `cells/uL`. A shows the third convention on its own 2024-11-01 value: `"268"` labelled `10*3/uL`.
- **Naive mapper:** compares 212 to 212000 and calls one thrombocytopenic, or dedupes them as different.
- **Key catches it:** lab key normalized to 10³/µL; cohort "platelets ≥ 100" includes her.

### T8. (Dropped)
- Creatinine in µmol/L at a US lab was not credible; dropped at Stage 0a (see `work/decisions.md`). The
  number is kept so later trap numbers stay stable. Unit traps are T6 and T7.

### T9. Numbers stored as text, with operators and a sentinel (Epic-inspired: value cluster)
- **Hero:** C stores every result in `VALUE_TEXT` (text) and `VALUE_NUM` (numeric). For ">60" the
  numeric column holds `9999999`, a sentinel for "read the text". C printed eGFR ≥ 60 as ">60" only
  until 2021-06-30 (numbers up to 90 from 2021-07-01), so 2021-01-14 is ">60" and 2021-09-20 is 64.
  Troponin "<0.01" in A is a string with an operator.
- **Naive mapper:** eGFR of 9,999,999 in 2021; sorts "9" above "41" as text; drops "<0.01".
- **Key catches it:** eGFR series key keeps the reported value `{ comparator: ">", value: 60 }` for
  2021-01-14, next to the recomputed CKD-EPI 2021 value (68; see T11).

### T10. Date-only and time-zone shifts
- **Hero:** ED arrival 2024-11-01 21:40 local (CDT, UTC−5) is `2024-11-02T02:40:00Z` in A; daylight
  time ends during the stay (11-03 02:00), so A's later UTC times are UTC−6 local. HomeLog stores local
  wall time with no offset. Problem onsets in B are year-only ("2016").
- **Naive mapper:** places the ED visit on Nov 2 and home readings 5–6 hours off; turns "2016" into
  2016-01-01 and computes a precise duration.
- **Key catches it:** encounter key keeps date 2024-11-01 local; onset key carries
  `precision: "year"`.

### T11. eGFR equation change
- **Hero:** until 2022-01-10, C reports two eGFR rows per creatinine (CKD-EPI 2009 "non-African
  American" 55 and "African American" 64, different local codes). Their LOINC codes, 48642-3 and
  48643-1, are the MDRD race-specific codes, so a mapper trusting LOINC gets the equation wrong too.
  From 2022-01-10, one row with CKD-EPI 2021 race-free under a new local code with no LOINC. A reporting
  rule changes as well: ≥ 60 is printed ">60" until 2021-06-30 and as a number from 2021-07-01 (T9).
- **Naive mapper:** takes the AA row (or the max) and shows a false decline 64 → 54 that is partly an equation artifact, or misses
  the series break by matching only one code.
- **Key catches it:** eGFR key is CKD-EPI 2021 recomputed from creatinine for the whole series
  (2021-01-14 → 68, 2021-09-20 → 58), with original reported values kept alongside. The decline-rate cohort uses the
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
- **Hero:** DKA precipitant (gastroenteritis, poor intake) is only in A's prose (narrative-only span
  `precipitant` in the H&P and discharge summary) and P's notes; "kept taking empagliflozin while
  sick" is only in P, which says "still taking my pills" without naming the drug; "sick day rules
  reviewed" only in a B note; the re-challenge decision only in C's note. The glargine self-adjustment
  ("12 if my sugar was over 200") is in P's own words.
- **Related, self-report only:** OTC ibuprofen is structured, but only on P's self-reported medicine
  list; a med list merged from A, B and C misses it.
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
- **Hero:** each A document (ED note, H&P, 3 progress notes, endocrinology consult, discharge summary)
  re-lists all home meds with that document's status for each.
- **Naive mapper:** counts seven sertraline "orders"; takes the first document's status instead of the
  latest.
- **Key catches it:** A's contribution to the med key is the discharge summary's list only.

### T16. Local codes without standard codes
- **Hero:** C's eGFR, UACR and K use local codes (`LK-EGFR21`, `LK-UACR`, `LK-K`) with LOINC present
  for only some; B uses RxNorm for most meds but its finerenone import from C has only a local drug id;
  A's "SGLT2i-associated euglycemic DKA" is ICD-10 E11.10 plus a local subtype code.
- **Naive mapper:** filters on LOINC only and misses half the eGFR series.
- **Key catches it:** eGFR series key has every value regardless of coding.

### T17. Fuzzy onset (Epic-inspired: accuracy-flagged dates)
- **Hero:** B's problem and allergy onsets are `{ date, precision }`, with a full date whose filler
  parts are `01`: HTN `{ date: "2014-01-01", precision: "year" }`.
- See T10 for what goes wrong.

### T18. Same reaction, two shapes
- **Hero:** A records euglycemic DKA as an encounter diagnosis; B records "empagliflozin → euglycemic
  DKA" as an adverse reaction entry. Lisinopril cough is an intolerance, not an allergy, in B; A has no
  intolerance category and lists it as an allergy with reaction "cough".
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
