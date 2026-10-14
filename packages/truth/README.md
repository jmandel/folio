# @folio/truth

The source-neutral clinical truth ([truth/MODEL.md](../../truth/MODEL.md)): the hero encoded by hand,
four secondary patients, a seeded population, and the answer keys computed from them.

| File | What it holds |
|---|---|
| `src/model.ts` | Types, time helpers (zone-aware instants, partial dates), CKD-EPI 2009/2021 |
| `src/catalog.ts` | Drug products (RxNorm ingredient + SCD), conditions (SNOMED + ICD-10), analytes (canonical units, LOINC) |
| `src/staff.ts` | Clinicians at the four organizations |
| `src/hero.ts` | Linda Okafor, from [truth/HERO.md](../../truth/HERO.md) and the Stage 0 examples; `deriveTraps` |
| `src/secondaries.ts` | Four hand-picked secondaries (see below) |
| `src/population.ts` | The generator: archetype quotas, chronological simulation, admissions, nephrology, HomeLog |
| `src/finalize.ts` | Derived parts: eGFR rows from creatinine with what the lab reported (T9, T11), copies (T14), history order |
| `src/keys.ts` | Per-patient answer keys and the six cohort keys |
| `src/index.ts` | `buildTruth(seed, size)` = hero + secondaries + population |

## How the population is made

`assignArchetypes(seed, n)` places each planted event ("archetype") on an exact number of patients
(`QUOTAS`, scaled to the population size), so trap and cohort rates are controlled rather than
sampled. `generatePatient(spec)` then simulates one patient from a random stream named after the
patient: primary-care visits every 4-11 months with same-morning Lakeview labs, treat-to-target
changes (metformin dose by eGFR, A1c-driven intensification, BP-driven ACEi/ARB, thiazide, CCB),
CKD staging on Northgate's problem list once two eGFRs < 60 are 90 days apart (rarely updated
afterwards, T5), then the planted events: ACE-inhibitor cough with a recorded negation, true
angioedema, SGLT2i DKA with or without a documented precipitant, AKI with hyperkalemia, pneumonia,
chest pain with ACS ruled out, hemolyzed and confirmed potassium, sick-day holds, entered-in-error
orders, duplicate lab orders, nephrology referral and care (finerenone, holds by phone, decisions
that exist only in the note), and the patient's own app (home BP and glucose, a meter set to mmol/L
for a while, typed duplicates, OTC NSAIDs, diary notes). Sources that end up with nothing about a
patient are dropped, so every patient appears in the sources that actually know them.

| Secondary | Built to show |
|---|---|
| `s01` Marcus Bell | CKD progression on an SGLT2i with no DKA (cohort 1, where the hero is excluded); early ">60" and race-variant eGFR rows (T9, T11) |
| `s02` Rosa Delgado | SGLT2i-associated DKA with the precipitant only in prose (cohort 2); a mmol/L meter (T6) |
| `s03` Walter Kim | HFrEF on spironolactone: a hemolyzed potassium that must not count and a confirmed one that does (cohort 3); AKI admission |
| `s04` Janet Morrow | Masked hypertension (cohort 5) with typed duplicates and a typo fix; ACE-inhibitor angioedema (cohort 6); depression on an SSRI (T19) |

## Differences from the sketch in truth/MODEL.md

- `FuzzyDate` is a string whose precision is its length (`"2016"`, `"2016-06"`, `"2016-06-14"`) or
  an RFC 3339 instant with the patient's offset. This is the spec's partial-date rule.
- New entities: `LabDraw` (one requisition), `Staff`, `Referral`, `HomeLogPlan` (diary notes, dose
  logs, medicine-list saves: patient-generated material that is not a clinical fact).
- `Encounter.documents[].plan` lists the structured content of each hospital document (which labs,
  vitals, diagnoses, history lines, inpatient orders it shows); home meds and allergies are always
  re-listed (T15). Per-document statuses are derived from history entries tagged with `doc`.
- Med history entries carry `restartAdvice`, `instructions`, `stopReason`, `reviewOn`, `takenAs`
  and `doc`; `Medication` carries a catalog `product`, `setting` (home/inpatient), `prescriber`.
- `LabResult` carries `resultedAt`, `finalAt` (preliminary until then, T14 within the hospital),
  `correctedAt`, `duplicateOf` (T4). eGFR rows are computed from creatinine by `finalize`.
- `Vital` is a set (`kind: "set"`), a home BP (`"bp"`) or home glucose (`"home-glucose"`, canonical
  mg/dL with `renderedUnit`), with `duplicateOf` and `typo` for HomeLog's T14 cases.
- `NarrativeFact` has a `kind`, regex `evidence` used by the prose validator and the coverage check,
  and an optional narrative-only `span` id per source.

## Hero values added beyond truth/HERO.md

Routine Northgate visits (2019-03-18, 2019-09-16, 2021-01-18, 2021-06-03, 2021-09-27, 2022-05-16,
2023-03-06, 2023-09-11, 2024-04-15, 2024-11-12, 2025-02-17, 2025-08-18, 2026-05-04) with vitals; the
referral steps (scheduled 2026-06-02, closed 2026-07-20); three Riverside progress notes and two
extra inpatient panels (11-02 17:05Z and 11-04 12:00Z); a Lakeview phone contact on 2026-08-10;
twice-weekly home readings 2023-04 to 2026-10 and nightly insulin logs; medicine-list saves on
2023-04-11, 2025-08-18, 2026-03-28 and 2026-05-02 (Jardiance and lisinopril are added as history
only in 2026-03, which is why they are `med_8`/`med_9` in the example); diary notes around the DKA,
the self-adjusted glargine, the knee and the finerenone hold. The problem-list key includes
hyponatremia (active: Riverside 2024, Lakeview 2026-07-13), which HERO.md's "Current truth" omits.

## Answer keys

`patientKeys(p)` gives active meds, problems (active + resolved), allergies, latest labs, lab
series, vitals (clinic, hospital, home BP, home glucose in mg/dL) and encounters as of 2026-10-13,
each entry with `sources` and `basis` (truth ids). `cohorts(ps)` gives the six cohort keys with
their exact definitions (in the output JSON); cohort 1 excludes inpatient and ED eGFRs from both
the staging and the slope, per work/decisions.md.

RxNorm SCD codes for population drugs, and some LOINC/SNOMED codes, are best-effort and were not
checked against the terminology files.
