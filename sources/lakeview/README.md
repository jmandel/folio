# Lakeview Labs & Kidney Care (source C)

An outreach reference lab and a nephrology clinic sharing one system. Northgate Family Medicine has
sent its outpatient lab work here since 2021, so Lakeview holds every one of Linda Okafor's outpatient
results. Its nephrology clinic takes her referral in 2026-06 and first sees her on 2026-07-13. Issuer `did:web:lakeview-labs.example`; Linda is
patient `LV-0072914`. Schema: [`schema/lakeview-v1.d.ts`](schema/lakeview-v1.d.ts).

## Modeling style

- **Each payload entry is a table row.** `type` is the table name; columns keep their database names
  (`ORDER_STATUS`, `VALUE_TEXT`). Rows point at each other by Lakeview ids (`ORDER_ID`, `RX_ID`).
- **Codes, not words.** Integer and letter status codes, local test codes, unit strings in their own
  column. Every code value is listed in a docstring or in the code tables (`export declare enum`) at the end
  of the schema.
- **Values as stored.** Lab values are text (`VALUE_TEXT`) plus a numeric copy with a sentinel
  (`VALUE_NUM`).
- **Corrections re-publish the whole requisition or contact** as a superseding item. Medication status
  changes are history rows in later contacts instead.
- **Little prose.** Lab items have none. Clinic contacts carry the nephrologist's short signed note.

## Entry types

| Item | `schema.type` | Rows |
|---|---|---|
| One per lab requisition | `LabReportRow` | `LAB_REQ`, `LAB_ORDER`, `LAB_RESULT` |
| One per clinic contact (visit or phone) | `ClinicRow` | `CLINIC_VISIT`, `VISIT_DX`, `VITAL`, `MED_ORDER`, `MED_STATUS_HIST` |

## Traps planted here

| Trap | How it shows up | Example |
|---|---|---|
| T1 held vs discontinued | `MED_STATUS` 1/2/3/9; finerenone's hold is a `MED_STATUS_HIST` row (1 → 3) while its `MED_ORDER` row still says 1. | [2026-09-14](examples/2026-09-14-finerenone-hold.folio.md) |
| T2 two status axes | `ORDER_STATUS` (1–5, 9) vs `RESULT_STATUS` (P/F/A/C/X): the 2022 potassium order is 4 (resulted) while its only result is 'C'. | [2022-09-12](examples/2022-09-12-potassium-corrected.folio.md) |
| T3 corrected vs confirmed | K 6.1 hemolyzed: 'C', `REPLACED_BY_RESULT_ID` → redraw 4.6. 2026-09-14 K 5.8 / 5.7: repeat with `REPEAT_REASON` 'CONF'; both stay 'F'. Lakeview's 'C' marks the *old* value, unlike HL7. | [2022-09-12](examples/2022-09-12-potassium-corrected.folio.md) |
| T4 entered in error | Duplicate A1c order with `ORDER_STATUS` 9 whose result row is still 'F'. | [2025-08-18](examples/2025-08-18-a1c-cbc.folio.md) |
| T5 stale problem list | Lakeview records CKD G3b/A3 and N18.32 on 2026-07-13 (Northgate still says 3a). | [2026-07-13](examples/2026-07-13-nephrology-new-visit.folio.md) |
| T7 platelets ×10³ | `"212"` with `UNIT_CODE` `K/uL`. | [2025-08-18](examples/2025-08-18-a1c-cbc.folio.md) |
| T9 text values, sentinel | `VALUE_TEXT` ">60", `VALUE_NUM` 9999999. | [2021-01-14](examples/2021-01-14-creatinine-a1c.folio.md) |
| T11 eGFR equation change | Two CKD-EPI 2009 rows (`LK-EGFR09N`, `LK-EGFR09A`) until 2022-01-09, carrying the MDRD LOINC codes 48642-3 / 48643-1; one `LK-EGFR21` row (no LOINC) after. Values ≥ 60 print as ">60" until 2021-06-30, as numbers from 2021-07-01. | [2021-01-14](examples/2021-01-14-creatinine-a1c.folio.md), [2026-02-09](examples/2026-02-09-renal-panel-a1c.folio.md) |
| T13 prose-only fact | The SGLT2i re-challenge decision is a narrative-only span (`sglt2_decision`). | [2026-07-13](examples/2026-07-13-nephrology-new-visit.folio.md) |
| T14 duplicates | Lakeview is the original of every result Northgate imports; `ACCESSION` is the shared key. | all lab items |
| T16 local codes | `LK-EGFR21` never has LOINC; `LK-K` and `LK-UACR` have LOINC only on rows from 2023-05-01; finerenone has a formulary id and no RxNorm. | [2022-09-12](examples/2022-09-12-potassium-corrected.folio.md), [2026-02-09](examples/2026-02-09-renal-panel-a1c.folio.md), [2026-07-13](examples/2026-07-13-nephrology-new-visit.folio.md) |
