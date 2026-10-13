# Stage 0c receipt: spec, truth and sources reconciled

Decisions recorded in `work/decisions.md` under "Stage 0c". Check: `bun work/check-examples.ts`
(22 payloads pass `tsc --strict --noEmit`; every `<ref id>` names a payload key or a narrative-only span
documented in the source README; envelope time forms and ULIDs are valid). 0 problems.

## Changes per file

**spec/record-item.md**
- `effective` allows partial dates; new "Dates and times" section (offset or date in the envelope;
  zone-less times only in payloads, documented in the schema; no invented offsets).
- Narrative-only spans: citation anchors and disclosure units; a span may be an entry's main content;
  parsers match `<ref id="` exactly.
- Payload: entry ids are item-local; source-native foreign keys are allowed.
- Corrections rewritten: supersede for any content change, including corrected or invalidated results;
  retract only for entered in error; ids only; envelope wins over a payload echo; `effective` on
  superseding and retraction items; status rows are not corrections.
- New "Span boundaries are disclosure boundaries" rule with the sertraline example.
- Examples moved to a neutral issuer (Maple Street Clinic, Dr. Whitfield).

**spec/schema-conventions.md**: code tables as `export declare enum` with `` `${Enum}` `` field types;
integer codes documented in the field docstring; separately disclosable things must be top-level
entries; field names are the source's own; helper aliases allowed; docstrings cover copies and
zone-less times. Example renamed to Maple Street.

**truth/HERO.md**: A/P source rows; ED row at 02:40Z with Cr 1.41, eGFR 43, platelets 268, and lipase
moved to the H&P; admission times and the DST change; losartan and atorvastatin continued; 2021-07-01
reporting rule and MDRD LOINCs; K 6.1 supersession; glargine self-adjustment (2025-10); ibuprofen
(2026-03-28); B finerenone outside line (2026-07-20) and the 09-14 hold row; current meds; matrix rows;
exchange question 5.

**truth/TRAPS.md**: T1 (B event shape, C history row, B stale line), T2 codes, T3 supersession, T7 268,
T8 dropped, T9 reporting rule and key with recomputed 68, T10 02:40Z and DST, T11 MDRD LOINCs and
rule, T13 spans, wording and self-report-only ibuprofen, T15 seven documents, T17 shape, T18 A allergy.

**truth/MODEL.md**: `otc`, `takenAs`, `laggingLines` on Medication; more analytes; `reported` gains
`comparator` and `loinc`; consult document kind; active-meds key rule for OTC and `takenAs`.

**sources/lakeview**: schema code tables changed to enums (LabTestCode, LakeviewUnit, FrequencyCode),
with typed fields; eGFR09 LOINCs changed to 48642-3/48643-1 (schema and the 2021-01-14 example);
nephrologist renamed to Helen Marsh; new random parts for the ULIDs; README updated.

**sources/northgate**: lab corrections are superseding `imported_result` items; `source_corrected`
removed; a void's `effective` equals its `recorded` (example fixed to 08:47:55); README T3, T11 and T13.

**sources/riverside**: the H&P says "On 10/29" (it said "three days ago"), matching the ED note and
HomeLog.

**sources/homelog**: Jardiance RxNorm changed to 1545658; new random parts for the ULIDs.

**sources/*/NOTES.md**: a header pointing to Stage 0c; ids and the clinician name updated.

**work/check-examples.ts**: new check script.

## Not reconciled (open)

- Whether inpatient eGFRs (Riverside 43/45/46) count toward cohort 1's decline rate (Riverside note 4).
- Riverside story choices kept as written: empagliflozin's last dose left vague, gastroenteritis not
  coded, and the endocrinology note hinting at the re-challenge question (notes 6, 7, 9).
- Spec ideas not adopted: an envelope `tz`, rules for times repeated between envelope and payload,
  marking partly generated narrative, and an encounter grouping hint (still deferred).
- RxNorm and LOINC codes across sources still need checking against the terminology files.
