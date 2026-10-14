# Clinical truth model

The generator's source-neutral record of what actually happened to each patient. Renderers turn it into
each source's items ([HERO.md](HERO.md#sources)); answer keys are computed from it directly. Nothing in
the truth knows about any source's codes, units or statuses beyond a canonical choice made here.

Design rules:

- **Canonical units and codes.** Labs in one unit per analyte (mg/dL, 10³/µL, mmol/L for electrolytes
  and ketones, mL/min/1.73m²); conditions carry SNOMED + ICD-10; meds carry RxNorm ingredient + strength.
  Renderers convert *away* from canonical; answer keys stay canonical.
- **Events, not states.** Med and condition histories are lists of dated status changes; "current"
  is derived.
- **Every fact says who could know it.** `visibility` lists the sources that record the fact and in what
  modality (prose, structured, both). That drives renderers and lets us score prose-only facts
  separately.
- **Traps are data.** A planted trap is a tagged property of a fact (`traps: ["T3"]`), so trap coverage is
  a query over the truth.

## Type sketch

```ts
type SourceKey = "A" | "B" | "C" | "P";
type Modality = "prose" | "structured" | "both";
type Visibility = Partial<Record<SourceKey, Modality>>;
type TrapId = `T${number}`;

interface FuzzyDate { value: string; precision: "year" | "month" | "day" | "instant"; tz?: string } // value ISO, local
interface Coding { system: "snomed" | "icd10" | "rxnorm" | "loinc"; code: string; display: string }

interface Patient {
  id: string;                    // truth id, never rendered
  demographics: { name: string; birthDate: string; sex: "F" | "M"; race?: string; tz: string };
  sources: Record<SourceKey, { localId: string } | undefined>;   // which sources know the patient
  sensitivity: { category: "behavioral-health" | "reproductive" | "substance-use"; factIds: string[] }[];
  encounters: Encounter[]; conditions: Condition[]; meds: Medication[]; labs: LabResult[];
  vitals: Vital[]; allergies: AllergyIntolerance[]; narrativeFacts: NarrativeFact[];
}

interface Encounter {
  id: string; source: SourceKey; kind: "office" | "ed" | "inpatient" | "telehealth" | "lab-only" | "home";
  start: FuzzyDate; end?: FuzzyDate; reason: string; clinician?: string;
  documents: { kind: "ed-note" | "h&p" | "progress" | "consult" | "discharge" | "office-note" | "letter"
                    | "patient-note";
               at: FuzzyDate; factIds: string[] }[];   // which facts each document mentions (drives prose + re-snapshots, T15)
}

interface Condition {
  id: string; coding: Coding[]; onset: FuzzyDate;      // T10/T17
  history: { at: FuzzyDate; status: "active" | "resolved" | "ruled-out"; stage?: string; recordedBy: SourceKey }[];
  visibility: Visibility; traps?: TrapId[];
}

interface Medication {
  id: string; rxnorm: Coding; doseText: string; dose?: { value: number; unit: string }; frequency: string;
  otc?: boolean;                                        // bought without a prescription (ibuprofen); usually only P knows
  history: { at: FuzzyDate; status: "active" | "held" | "stopped" | "entered-in-error";
             reason?: string; by: SourceKey; intendResume?: boolean;   // T1, T4
             doseText?: string; dose?: { value: number; unit: string }; frequency?: string;
                                                        // set on a dose change (losartan 50 → 100 mg 2025-08,
                                                        // metformin 1000 → 500 mg BID 2026-02); the top-level
                                                        // dose is the starting one
             takenAs?: string }[];                      // how the patient actually takes it when that differs
                                                        // from the prescription (self-adjusted glargine), by: "P"
  laggingLines?: { source: SourceKey; showsStatus: "active" | "held" | "stopped"; since: FuzzyDate }[];
                                                        // a source's copy that was never updated (B's outside finerenone line, T1)
  visibility: Visibility; traps?: TrapId[];
}

interface LabResult {
  id: string; analyte: "creatinine" | "egfr" | "potassium" | "sodium" | "chloride" | "bicarbonate"
          | "anion-gap" | "bun" | "glucose" | "a1c" | "uacr" | "platelets" | "wbc" | "hemoglobin"
          | "bhb" | "ph" | "pco2" | "lipase" | "troponin";
  loinc?: Coding; collectedAt: FuzzyDate; specimen: "serum" | "plasma" | "urine" | "whole-blood" | "capillary";
  value: number; comparator?: "<" | ">" ;              // T9
  unit: string;                                         // canonical
  status: "final" | "corrected-away" | "entered-in-error";
  replacedBy?: string; confirms?: string;               // T3: correction vs confirmation
  derivedFrom?: string[];                               // eGFR ← creatinine (T11)
  reported?: { equation: "ckd-epi-2009-nonaa" | "ckd-epi-2009-aa" | "ckd-epi-2021"; value: number;
               comparator?: ">";                       // C printed ≥ 60 as ">60" until 2021-06-30 (T9)
               loinc?: string }[];                      // as the source coded it: MDRD codes on 2009 rows (T11)
  orderedBy: SourceKey; performedBy: SourceKey; copies?: SourceKey[];   // T14
  annotations?: string[];                               // "hemolyzed"
  visibility: Visibility; traps?: TrapId[];
}

interface Vital {
  id: string; kind: "bp" | "weight" | "pulse" | "home-glucose"; at: FuzzyDate;
  value: { systolic?: number; diastolic?: number; value?: number }; unit: string; setting: "clinic" | "home";
  source: SourceKey; renderedUnit?: string;             // T6: home glucose rendered mmol/L before a date
}

interface AllergyIntolerance {
  id: string; substance: Coding; type: "allergy" | "intolerance" | "adverse-reaction";
  reaction: string; criticality: "low" | "high"; onset: FuzzyDate;
  negatedFindings?: string[];                           // "no angioedema" (T12)
  visibility: Visibility; traps?: TrapId[];
}

/** Facts that exist only (or mainly) as prose: precipitants, decisions, patient reports. */
interface NarrativeFact {
  id: string; at: FuzzyDate; statement: string;         // canonical one-sentence form
  about?: string[];                                     // ids of conditions/meds it explains
  polarity: "affirmed" | "negated";                     // T12
  visibility: Visibility; traps?: TrapId[];
}
```

## Answer keys

All keys are computed as of an evaluation time `t` (default 2026-10-13) and stored as canonical JSON in
`truth/keys/<patient>/<view>.json`, with a `basis` field listing the truth ids each entry came from.

| View | Rule |
|---|---|
| **Active meds** | Every `Medication` whose latest history entry at `t` is `active` or `held` (with `status`); `entered-in-error` meds never appear. One entry per drug+strength, `sources` = all sources that recorded it. Patient-reported OTC meds are included (`otc: true`, sources `["P"]`). The dose is the currently prescribed one (the latest history entry that sets a dose, else the starting dose); a patient-reported `takenAs` is carried next to it. Lagging lines are not used. |
| **Problem list** | Conditions whose latest status at `t` is `active`, with the most specific stage *recorded by any source* (not lab-inferred); `ruled-out` and `resolved` excluded (resolved shown in a separate history list). Onset keeps its precision. |
| **Latest labs** | Per analyte, the most recent `final` result at `t`; corrected-away and entered-in-error excluded; confirmations both count but latest wins; one entry even if copied to other sources. eGFR is the CKD-EPI 2021 value. |
| **Lab series** | All `final` results per analyte in canonical units, deduplicated across copies. |
| **Vitals series** | Clinic and home separated; home glucose converted to mg/dL; times in the patient's local time zone. |
| **Allergies & intolerances** | Every `AllergyIntolerance` with `type`, `criticality`, and negated findings. |
| **Encounters** | Local start date, kind, reason, source. |

Mapper scoring compares each mapper's output to the key for the same patient, *restricted to what that
source could know* (`visibility` includes the source). Merged-chart scoring compares the union of all
sources' mapped output to the full key. Prose-only facts are scored separately from structured facts.

## Cohort keys

Each cohort is a predicate over the truth, evaluated at `t`, producing a patient set plus, per patient,
the truth ids that justify inclusion. Candidates (each lists the traps it exercises):

1. **CKD progression on an SGLT2i, no DKA history.** CKD stage 3 (two race-free eGFRs 30–59 at least 90
   days apart), eGFR decline > 5 mL/min/1.73m² per year over the last 2 years, SGLT2i *active* (not held
   or stopped) at `t`, and no DKA ever. Traps: T1, T9, T11, T12, T16. (Linda is *excluded*: stopped
   SGLT2i, DKA history.)
2. **SGLT2i-associated DKA with a documented precipitant.** Any DKA while an SGLT2i was active, where the
   record states a precipitant (illness, surgery, fasting, alcohol). Traps: T13, T18, T15. (Linda is
   *included*; the precipitant is prose-only.)
3. **Confirmed hyperkalemia on RAAS or MRA therapy.** K ≥ 5.5 mmol/L not corrected away by a redraw,
   while an ACEi, ARB or finerenone was active or held within 30 days. Traps: T2, T3, T4, T1. (Linda:
   2026-09 included; 2022-09 does not count.)
4. **Uncontrolled diabetes on insulin with kidney disease.** Latest A1c ≥ 8.0% within 12 months, basal
   insulin active, eGFR < 45. Traps: T4 (duplicate A1c), T9, T11, T14. (Linda: included.)
5. **Masked hypertension.** Mean home systolic ≥ 135 over the last 30 days of home readings, while the
   last two clinic systolic readings are < 130. Traps: T6-style unit/time handling (T10), duplicates
   from re-synced app data (T14). Linda's outcome is set by the generator.

ACE-inhibitor angioedema (T12 negation, lexical false positive) is a sixth candidate if we want a cohort
where text search alone does badly.
