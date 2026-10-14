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

## Stage 0e (2026-10-13): review fixes

- **Medication changes adopted into truth**: losartan 50 → 100 mg (maximum dose) at Northgate on
  2025-08-18, so finerenone in 2026-07 is added on top of maximal ARB; metformin 1000 → 500 mg BID at
  Northgate on 2026-02-11 (eGFR 41). HomeLog's 2026-05-02 list agrees with both.
- **Labs adopted**: K 4.6 on 2026-02-09 (baseline before finerenone); the 4-week check on 2026-08-10
  has Cr 1.50 / eGFR 40 with the K 5.2; 2026-09-14 has Cr 1.52 / eGFR 39 with the K 5.8, then the CONF
  repeat 5.7. The 2-week recheck due 2026-09-28 was never drawn; finerenone stays held at 2026-10-13.
- **Riverside DKA course**: losartan held with chlorthalidone (volume depletion, K 5.0); glargine 14 u
  given 2 h before the drip stopped (09:00 CST, after the 06:10 BMP showed the gap closed); venous
  pCO₂ 28 (Winter's formula). Glargine stops at discharge.
- **Riverside `held`**: one meaning (paused, someone decides later). The new `restart_advice` field
  says which way the author leans; empagliflozin at discharge is `advise_against`.
- **Northgate diagnoses**: `billing_dx` and `referral_dx` are top-level entries, per the
  disclosure-boundary rule.
- **Schema hashes**: real SHA-256 in every example (`bun work/schema-hashes.ts`); `check-examples.ts`
  fails on a stale hash.
- **NPIs** (1999000017, 1999000042, the spec's 1952384017) fail the NPI Luhn check. Kept: they can
  never collide with real NPIs. A validator that checks NPIs must allowlist them.

## Stage 2 follow-up (orchestrator)
- **Signing is a build step**: items are signed once (deterministically keyed, salts from a seeded RNG in dev) and the signed corpus is what nodes serve and what the site ships. Nodes do not re-sign on start. To do when Stage 1's corpus merges.
- **Feed authentication**: out of scope for the demo; spec/sync.md names it as a deployment requirement (OAuth/SMART), nothing more.
- **Node log persistence across restarts**: not needed; nodes serve a directory.
- **Key binding for agent exchanges**: decide in Stage 6.

## Stage 3 round 3 (2026-10-14): truth and key fixes after the round-2 audit

Each change was checked against the regenerated raw items (corpus/), not only the truth.

- **HomeLog strength text in the product's unit.** The generator wrote every tablet strength as "<n> mg", so
  levothyroxine 75 mcg appeared as "75 mg" next to a picked RxNorm product "levothyroxine sodium 0.075 MG Oral
  Tablet". It now writes the catalog unit ("75 mcg"; pens "<n> mg pen" / "100 units/mL pen"). Reason: a mapper that
  read the record's own RxNorm code was scored wrong.
- **No restart after an adverse reaction.** p218 was restarted on empagliflozin for HFrEF three months after
  SGLT2i-associated DKA: the DKA's SGLT2i line is created later in the simulation, back-dated, after the visit loop had
  already planned a later start. The visit loop now skips a planned SGLT2i start on or after a planned DKA date.
  ACE-inhibitor angioedema (p010 and others): the visit loop kept escalating and holding the lisinopril line after the
  (back-dated) ED visit. The simulation now treats every ACE inhibitor as stopped from the day after a planned
  angioedema date, and the angioedema follow-up reuses an existing amlodipine line (raising its dose) instead of
  opening a second one. `buildTruth` now checks plausibility on every build and fails on: two active lines of one
  ingredient at once; a start or re-activation after an allergy or adverse-reaction entry for the same ingredient,
  or after an adverse reaction to a drug of the same class.
- **Duplicate active-meds answers.** s04 (amlodipine twice: baseline line plus the angioedema replacement) and p104
  (dapagliflozin twice: Lakeview's back-dated start plus Northgate's later start). Fixed by the rules above (amlodipine
  line reused; Lakeview does not open an SGLT2i line when one exists anywhere in the simulation).
- **Merged-chart status from structured records only.** When no source's structured record carries the truth's
  current status for a medication (e.g. a resumption written only as "resumed today" in a visit note), the merged-key
  row is reported in a separate "prose-only" category, not counted as a wrong row.
- **Underdetermined cases become accepted equivalents or exclusions, stated in the views (v3):**
  - a once-daily-at-night direction written only as "nightly" (Riverside) is accepted as QHS or QD;
  - a patient-list entry with a strength but no directions has no dose (the key no longer asserts one);
  - a patient list that names one drug twice with different statuses is not scored for that drug (excluded rows:
    matched mapper rows are neither right, wrong nor extra).
- All 165 notes whose requests changed were regenerated with the Stage 1 note pipeline (`bun run prose`, sonnet).
  `check:corpus` finds 0 problems.

## Stage 3 round 3: freeze and held-out design (recorded before the fresh cohort was generated)

- **Key and scorer code frozen** at hash `26ee28163e5c6e69` (sha256 over packages/compiler/src/{keys,score,evaluate,data}.ts,
  first 16 hex). Every round-3 compile record carries it; any later change shows as a different hash.
- **Fresh held-out cohort**: `FOLIO_COHORT=fresh`, seed `folio-stage3-fresh-final`, 180 patients, ids f001…, trap-targeted
  quotas (packages/truth/src/cohort.ts), written to corpus-fresh/ with notes from the Stage 1 note pipeline. Only
  aggregate trap counts are looked at (to size it); no record, key row or mapper output from it is looked at for
  triage. All round-3 headline numbers come from it; the main corpus's old test split is reported as a secondary table.
  (An earlier seed, `folio-stage3-fresh-2026-10-14`, was used to debug generator plausibility and is not used.)
- **Generator plausibility**: population patients that break a plausibility rule are regenerated from a derived seed
  with the same archetypes (packages/truth/src/plausibility.ts); baseline SGLT2i is not given to planned-DKA patients
  (random draws kept, so only p047, p116, p260 of the main cohort changed; their notes were regenerated).
- **Cache gate**: a cached (deployable) mapper must also have (wrong + extra rows) / rows < 1% in every view on the
  main cohort's dev split at the latest as-of date (report.ts DEV_GATE), besides type-checking, running without
  errors, determinism and a clean isolation scan.
- **Compile loop**: scores each new mapper on the main dev split only; held-out scoring is a separate step (`bun run score`).

## Stage 3 round 3: fixes after the round-3 audit (post-hoc; no new mappers run)

- **Northgate allergy mechanism (post-hoc key fix, made after the fresh scoring).** Northgate's schema defines
  `reaction_type: 'allergy'` as immune-mediated, and views v3 say to report `immune` when the source says so; the
  frozen key (26ee28163e5c6e69) accepted only `non_immune`/`unknown` for those rows, so mappers that followed the
  documentation were scored wrong on every Northgate lisinopril (ACE-inhibitor angioedema) row. The per-source key and
  the matching merged-key rows (allergy rows of type 'allergy' that Northgate records) now accept `immune` too. The
  conflict was visible on the main dev split (2/10 rows, every backend) before the fresh scoring and was not fixed then.
  New key/scorer hash `6a1a96c2620f6108` (the hash also covers a scorer synonym "mm[Hg]" = "mmHg" for the projected US Core units).
  All runs were rescored; frozen-key results are kept in results/stage3/evals-fresh-frozen-26ee28163e5c6e69/,
  evals-main-*-frozen-26ee28163e5c6e69/, scorecard-frozen-key.json and secondary-main-frozen-key.json, and SCORECARD.md
  shows both where they differ. The dev cache gate had been applied with the frozen key and selected against these
  mappers; the cache was not rebuilt.
- **Northgate referral diagnoses (renderer, for future cohorts).** `referral_dx` used the billing code (E11.22 for type 2
  diabetes with CKD) while the problem line kept E11.9 (e.g. fresh patient f007), although the schema says referral
  diagnoses are chosen from the problem list. The renderer now uses the problem line's code. The committed corpora
  (corpus/, corpus-fresh/) were not regenerated, so they still show the inconsistency.
- **Note quality.** Some LLM-written notes call lisinopril an "ARB" (fresh patients f030, f102). Not fixed; recorded
  for the note pipeline's checks.
- **US Core view.** `uscore.d.ts` prescribed LOINC 53060-9 for beta-hydroxybutyrate (not a LOINC code; now 6873-4,
  "Beta hydroxybutyrate [Moles/volume] in Serum or Plasma", checked with tx.fhir.org) and used the analyte unit "mmHg"
  as the UCUM code (now `mm[Hg]`). The US Core mappers were not recompiled.
- **Disclosure.** The fresh cohort's quotas were changed once after the freeze, after looking at aggregate trap counts
  only (dka_prec 26→36, dka_noprec 10→12).
