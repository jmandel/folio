# Decisions log (orchestrator)

Resolved at Stage 0a → 0b handoff (2026-10-13):

- **Partial dates**: allowed in `effective` and in payload date fields when the source only knows that much (`2019`, `2019-06`, `2019-06-14`); the precision is the string's precision. Spec to state it.
- **Section-level withholding**: no. The withholdable unit is a ref span (and its payload entry). Prose outside spans is disclosed whenever the item is.
- **Encounter grouping hint in envelope**: not now. Sources group in their payloads; revisit if the workbench timeline needs it.
- **T8 creatinine in µmol/L**: dropped — not credible at a US lab. Unit traps are T6 (glucose mg/dL vs mmol/L from the home meter) and T7 (platelets).
- **Problem-list stage in answer keys**: the key records the most recent clinician-asserted stage; a separately derived stage (from eGFR) is its own check, not the answer.
- **Patient-app records**: signed by the app's issuer (`did:web` of the app service), author = the patient.
- **Imported results**: B (primary care) issues its own copies of results interfaced from C, with a source note in the payload — this is how real EHRs behave and it is the T14 duplicate trap. B does not re-sign C's items.
- **Population size**: ~300 patients (Stage 1).

## Stage 0c (2026-10-13): reconciling spec, truth and the four Stage 0b sources

- **Dates and times**: partial dates (`2019`, `2019-06`) allowed in `effective` and payload dates;
  precision is the string's precision. Envelope `effective`/`effective_end` carry an offset or are a
  date; `recorded` always has an offset. Zone-less date-times only in payloads when the source truly
  lacks zone info, documented in the schema (HomeLog).
- **Span boundaries are disclosure boundaries**: a payload entry (with its spans) is disclosed or
  withheld as a unit. Independently sensitive facts must not share an entry or a span; panels may nest
  results, encounter/document entries must not nest med lists. Sertraline/depression is the example.
- **Narrative-only spans** are a normal tool: citation anchors and disclosure units.
- **Corrections**: a corrected or invalidated result *supersedes* the original (original stays in the
  history view); `retracts` is only for entered-in-error. A superseding item's `effective` is the
  clinical time; a retraction-only item's `effective` is the time of the retraction (= `recorded` unless
  the schema says otherwise). Entry ids are item-local; `supersedes`/`retracts` list item ids only.
  Northgate's K 6.1 copy is superseded (`result_status` 'C', "Result invalidated"), matching Lakeview;
  `chart_correction.reason` loses `source_corrected`.
- **Status rows vs supersession**: row-level status changes (Lakeview `MED_STATUS_HIST`) are legitimate;
  supersession replaces content, it does not model clinical state changes. The schema must say how to
  compute current state.
- **Code tables**: `export declare enum` with string members and a docstring per member, in the same
  `.d.ts`; fields typed `` `${Enum}` `` so payload JSON strings type-check. A new code is a new schema
  version. Lakeview converted.
- **ED arrival time**: Riverside is America/Chicago; 2024-11-01 21:40 CDT (UTC−5; DST ended 11-03) =
  `2024-11-02T02:40:00Z`. HERO/T10 corrected from 03:40Z.
- **Platelets**: Riverside's 2024-11-01 value is 268 `10*3/uL`; T7's 212 stays Lakeview 2025-08-18.
- **Finerenone**: Northgate carries an `outside` line added at a 2026-07-20 phone reconciliation and
  never updates it, so B shows finerenone active after Lakeview's 2026-09-14 hold (T1).
- **eGFR**: Lakeview printed eGFR ≥ 60 as ">60" until 2021-06-30, numbers from 2021-07-01 (T9, T11).
  The 2009 rows carry MDRD LOINCs 48642-3/48643-1 in both Lakeview and Northgate (T11). T9's key keeps
  the reported ">60" next to the recomputed CKD-EPI 2021 value (68).
- **HomeLog facts adopted into truth**: OTC ibuprofen 200 mg × 2 about twice a week (since ~2025, first
  on her list at the 2026-03-28 save; P only; new exchange question 5); glargine self-adjusted to 12 u
  when glucose > 200, from 2025-10 (the 2025-08-19 dose log shows 10 u at glucose 212).
- **Other fixes**: T8 marked dropped (number kept); T15 counts seven Riverside documents (consult);
  Lakeview's nephrologist renamed Helen Marsh (Priya Raman is Riverside's hospitalist); Lakeview and
  HomeLog ULIDs given fresh random parts (they reused Riverside's); HomeLog Jardiance RxNorm 1545658
  (SCD, as Northgate); spec examples moved to a neutral issuer (Maple Street Clinic).

## Stage 0c follow-up (orchestrator)
- **Inpatient eGFR in cohort 1**: excluded from the chronic decline slope (acute illness, e.g. the DKA admission AKI). The cohort definition must say so explicitly; this is itself a realistic trap for the verifier.
