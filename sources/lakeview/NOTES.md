# Lakeview (C): design notes and spec issues

> Stage 0c: the problems below were resolved (or left open) in `work/decisions.md` under "Stage 0c";
> see `work/stage0c-receipt.md` for what changed. This file is kept as the Stage 0b record.
> Stage 0e changed several values recorded below (see `work/stage0e-receipt.md`); the examples,
> schemas and `truth/` are authoritative.

## Decisions the story did not settle

1. **Item granularity.** Lab: one item per requisition (one draw, one ordering client), holding the
   requisition, its orders and their results. Clinic: one item per contact (office visit or phone call).
   A requisition can span several accessions (serum, urine, EDTA tubes). Northgate imports one item per
   *accession*, so one Lakeview item can map to several Northgate items; the shared key is `ACCESSION`.
2. **Aligned with Northgate's examples:** test codes `LK-CREAT`, `LK-EGFR09N`, `LK-EGFR09A`, accession
   format `LV21-263-00417`, eGFR comment text, reference range ">59". **Mismatch for Northgate to fix:**
   its 2021-09-20 example gives the 2009 eGFR rows LOINC `48642-3`/`48643-1`, which are the MDRD codes.
   Lakeview's table maps them to the CKD-EPI codes `88294-4` (non-Black) and `88293-6` (Black).
3. **HERO inconsistency, eGFR ">60".** 2021-01-14 eGFR is reported as ">60", but 2021-09-20 reports 64
   numerically. I added a reporting rule: until 2021-06-30 values ≥ 60 print as ">60"; from 2021-07-01
   numbers up to 90, ">90" above. Computed CKD-EPI 2009 values for 2021-01-14 (Cr 0.98, age 55) are 65
   (non-AA) and 75 (AA), so both rows print ">60".
4. **Lakeview's 'C' result status means "withdrawn", the opposite of HL7 v2 OBX-11 'C'.** Deliberate
   (it is what makes T2/T3 bite) and stated in the docstring. Northgate's schema uses HL7's meaning for
   its imported copies; Lakeview's HL7 interface is assumed to translate (Northgate retracts its copy).
5. **Medication status changes are history rows, not re-published orders.** The 2026-09-14 hold is a
   `MED_STATUS_HIST` row; the `MED_ORDER` row in the 2026-07-13 item still says `MED_STATUS: 1` and is
   *not* superseded. That keeps the visit item (and its note) intact and sharpens T1: a mapper that reads
   only `MED_ORDER` shows finerenone active. The alternative (supersede the visit item to restate the
   row) would have meant re-publishing a signed note to change one integer.
6. **T4 placement.** The duplicate A1c order (status 9) still has a final result row: the analyzer ran
   both before the clerk voided one. Both axes are visible in one item.
7. **No home med list in C.** The clinic records only what it prescribes or changes. Sertraline and the
   other home meds appear only in the 2026-07-13 note's prose.
8. **Values I added (not in HERO; the generator should adopt or override):**
   - 2025-08-18 CBC components WBC 6.8 K/uL, Hgb 12.1 g/dL (a platelets-only order is not credible).
   - 2026-07-13 vitals: BP 136/82, HR 78, weight 86.2 kg. Cohort 5 (masked hypertension) depends on clinic
     BP; the generator owns this value.
   - 2023-03-06 creatinine (not in an example): 1.28 mg/dL gives CKD-EPI 2021 eGFR 49 at age 57.
   - Clinician: Helen Marsh, MD (`npi:1999000042`); Northgate orderer Teresa Reyes, MD (`1999000017`).
     NPIs are deliberately fake.
   - ICD-10 for history of DKA: `Z86.39`, whose description never says "DKA". Mild information loss,
     the note carries the meaning.
9. **The 2026-07-13 note does not state the DKA precipitant** ("details per Riverside records"), to keep
   T13's precipitant in A and P only. It does mention sertraline (disclosed at intake, HERO exchange Q3).
10. **T8 dropped** per decisions.md: all Lakeview creatinine is mg/dL.
11. **Not shown in examples but needed by the generator:** 2021-09-20 (two eGFR rows 55/64); 2022-09-12
    original item (`01GCS992FRPWC6MKC8C79DYZY4`, K 6.1 'F' 'HH') and the redraw requisition (order
    `OR-6604420`, `REPEAT_OF_ORDER_ID` `OR-6604187`, `REPEAT_REASON` 'HEM', result `RS-71230566` = 4.6);
    2026-08-10 K 5.2; 2026-09-14 two requisitions (5.8, then repeat 'CONF' 5.7), client `LVNEPH`.

## Spec problems hit

1. **Code tables have no home.** A schema MUST be one file with no imports and only type declarations.
   I attached the lab test code, unit and frequency tables as docstrings on `export type X = never`
   aliases so they live in the hashed file. It works but is a hack. Options: allow a documentation-only
   section/export convention, or allow a schema to reference companion files pinned by hash. Also, code
   tables grow (new tests), which under the current rule forces a new schema URL each time.
2. **Column naming.** The spec mandates a lowercase `type` discriminator; all other Lakeview fields are
   UPPER_SNAKE. Mixed case reads a little oddly but is honest to the source. Worth one sentence in the
   conventions: field names are the source's own; only `type` is fixed.
3. **Superseding item vs in-place row history.** Supersession replaces a whole item. For coded tables,
   changes are naturally per row (one result invalidated). Restating the whole requisition is fine for
   labs, wrong for a signed note (see decision 5). The spec could say explicitly that a source may model
   later changes as new rows in new items instead of supersession, and that the schema must then explain
   how to compute current state.
4. **Cross-item row references.** `REPLACED_BY_RESULT_ID` and `MED_STATUS_HIST.RX_ID` point at rows in
   other items by source-native id, not by FOLIO item id + entry id. The spec mentions references by item
   `id`; it should say source-native foreign keys are fine and that resolving them needs the issuer's
   whole log.
5. **`effective` for a superseding correction.** I kept the original collection time (the clinical time
   is unchanged) and used `recorded` for the correction time. The spec should state that a superseding
   item's `effective` describes the clinical event, not the correction.
6. **Docstrings on literal-union members.** The table-per-field pattern (`- 'HEM': …`) works but for
   integer codes the TS type `1 | 2 | 3 | 9` alone looks like it needs no docs. Conventions could require
   it explicitly for numeric literal unions (they do in prose; an example with integers would help).
