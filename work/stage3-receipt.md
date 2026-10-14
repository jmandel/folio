# Stage 3 receipt (round 3, after the round-3 audit)

Branch `stage3`. Round 3 answers the audit that blocked round 2. This version also includes the fixes the round-3
audit asked for; no mapper was rerun for them. All numbers are in
[`results/stage3/SCORECARD.md`](../results/stage3/SCORECARD.md) and `scorecard.json`, with run ids. Round 1 and 2
results are kept in `results/stage3/round1/` and `round2/` and are not used.

## How the numbers were made

- **Views v3.** They were worded by an agent that saw no source, data or generator (run `20261014T151559955Z-roja`, sandboxed).
  - **Where the knowledge came from.** It worked from a brief by the corpus author that restates each source's quirks in general terms. For example:
    - a patient-list entry "paused or stopped for the time being" is held
    - "nightly" may be QHS or QD
    - a time with no count means one tablet, and there is no dose without directions
    - a count of 350 000 cells/uL is 350
    - the eGFR race-coefficient rule
    - a hand-entered duplicate of a device reading is reported once
    - zone-less times are local time
  - **What that means.** v3 does not measure reading a source schema without help. It carries the same source knowledge as v2, in general wording, without the corpus's strings.
  - **Leak check.** The literal leak check (`work/views-v3/`) finds no corpus strings; it cannot catch paraphrased rules.
- **Keys.** Key and scorer code were frozen at `26ee28163e5c6e69` before the fresh cohort was generated.
  - **Post-hoc fix.** After the fresh scoring, I made one labeled post-hoc key fix (`work/decisions.md`). Northgate's schema defines its `allergy` type as immune-mediated, and the views say to report `immune` when the source says so, so `immune` is now accepted for those rows. The new hash is `6a1a96c2620f6108`.
  - **Visible earlier.** The conflict was visible on the main dev split (2 of 10 rows, every backend) before the fresh scoring.
  - **Cache selection.** The dev cache gate, applied with the frozen key, selected against mappers that followed Northgate's documentation. Only one Northgate v3 mapper passed: Opus, which answered `unknown`. The cache was not rebuilt.
  - **Both results shown.** The scorecard shows frozen-key and corrected-key numbers side by side wherever they differ.
- **Fresh cohort.** 180 patients, new seed, notes from the same pipeline (`corpus-fresh/`).
  - **Quota change.** After the freeze, I changed the quotas once (dka_prec 26→36, dka_noprec 10→12), after looking at aggregate trap counts only.
  - **No triage.** I did not triage on the cohort.
- **Runs.** Mappers were compiled from the main corpus and scored once on the fresh cohort at three as-of dates; the latest date is primary.
  - **Condition a:** 3 runs each for Opus, codex and Sonnet with views v3.
  - **v2 vs v3 (Opus):** the v2 side reuses the three round-2 runs.
  - **Docs ablation:** full schema vs types-only, Opus, 3 runs each.
  - **Outcome:** all 60 mappers type-check, run on every patient and date, and are deterministic.

## Headline: views v3, one-shot, fresh cohort, 2026-10-13, corrected key

Wrong-row rate in percent: mean (min–max) over 3 runs; `+n` is extra rows in the worst run. Frozen-key values are in brackets where they differ.

| Source | View | rows | Opus | codex | Sonnet |
|---|---|---|---|---|---|
| Northgate | medications / labs / vitals | 1015 / 13126 / 1664 | 0 | 0 | 0 |
| Northgate | problems | 724 | 0.0 | 3.0 (0.0–4.6), +33 | 0.0 |
| Northgate | allergies | 87 | 0.0 [frozen: 13.0 (0.0–19.5)] | 0.0 [frozen: 19.5] | 0.0 [frozen: 19.5] |
| Lakeview | all four views | 31 / 181 / 13411 / 500 | 0 | 0 (+1 extra problem) | 0 |
| Riverside | medications / vitals | 549 / 487 | 0 | 0 | 0 |
| Riverside | problems | 119 | 0.0 | 0.0 | 4.8 (0.0–14.3) |
| Riverside | allergies | 77 | 0.0 | 0.0, +15 | 4.8 (0.0–14.3) |
| Riverside | labs | 3736 | 0.0 | 0.0 | 0.9 (0.0–2.6) |
| HomeLog | medications | 463 | 1.2 (0.0–3.0) | 8.1 (6.0–9.1) | 3.9 (2.8–6.0) |
| HomeLog | vitals | 10663 | 0 | 0 | 0 |

## What the errors are

- **Codex, Northgate problems.** Codex emits each referral diagnosis as a second problem row. That costs one wrong row plus one extra per patient, 33 + 33 in two runs and none in the third.
  - The corpus partly provoked this. The schema says referral diagnoses are chosen from the problem list, but in f007 the referral carries E11.22 while the problem line has E11.9.
  - That renderer bug is fixed for future cohorts (`decisions.md`); the committed corpora were not regenerated.
- **Codex, Riverside allergies (+15, +10 extra rows).** These are allergy rows built from AKI attributions ("attributed to naproxen / the ARB") that appear only in the narrative. The structured diagnosis is just "Acute kidney injury", and the views forbid narrative-only rows.
- **Sonnet, Riverside (one run).** The angioedema problem is missing, and lisinopril angioedema is typed `serious_adverse_event` instead of `hypersensitivity`. Another run misses some lab rows.
- **HomeLog medications:**
  - the glargine ingredient is missing (codex parses "3 ML insulin glargine…" as "ml");
  - "stop for now" entries are read as active (the views are explicit);
  - the ibuprofen dose "2 when my back hurts" is reported as 200 mg in one run (wrong) and omitted in another (defensible: the views omit a condition-dependent amount).
- **Opus, HomeLog T1 (19 of 51 facts).** Every case is the single generator string "doctor told me to stop for now".
- **Note quality.** Some notes call lisinopril an "ARB" (f030, f102).

## Views v2 vs v3, documentation ablation (Opus)

- **v2 vs v3.** With the corrected key, the only difference between v2 and v3 is HomeLog medications: 1.2% with v3, 0 with v2. The HomeLog training samples differ: the v2 runs saw "75 mg", the v3 runs "75 mcg". v2 also carries round-1 tuning.
- **Ablation, types-only schema vs full (views v3):**

  | Source and view | Types only | Full | Cause |
  |---|---|---|---|
  | Lakeview labs | 1.9% in all runs | 0 | eGFR ">60" read as the 9999999 sentinel |
  | Riverside allergies | 7.4% | 0 | one run typed lisinopril angioedema `side_effect` |
  | Riverside medications | 0.7% | 0 | |
  | Northgate allergies | 18.4% | 0 | one run typed DKA `side_effect` |
  | Northgate vitals | 0.1% | 0 | |
  | HomeLog | 1.0% | 1.2% | no difference |

  This is what this ablation shows. Because the views carry the source knowledge, it says little about how much the schema docs carry on their own.

## Merged chart

The prose-only carve-out catches 1 row. The reference mappers' remaining wrong medication rows (1.2%) are a real floor: 11 of them are Riverside discharge holds that outlive a stale Northgate "active" line.

| Mappers | Medications | Allergies |
|---|---|---|
| Reference | 1.2% | 0 |
| Agents, corrected key | 1.4–7.6% | 0 |
| Agents, frozen key | | 12.6% in most runs |

## US Core

- **Structure.** The HL7 validator, with terminology offline, found 1 structural error each in Northgate Opus and Riverside Opus (a duplicate `fullUrl`).
- **Codes.** tx.fhir.org found 0 invalid codes except Riverside's 2. Both were prescribed by `uscore.d.ts`, which now uses LOINC 6873-4 and `mm[Hg]`; the US Core mappers were not recompiled.
- **Display names.** There are display-name mismatches in Riverside and Lakeview.
- **Not checked.** Value-set binding against tx.fhir.org was not checked, because it was too slow.

## Isolation and cost

- **Isolation.** The transcript scan covered 187 runs. Outside the probes it found:
  - one network-tool call, the views writer's `npx -y tsc`, which the proxy refused;
  - no IPC or web-tool calls.
- **Cost of round 3:** about $74. Opus $36.35, Sonnet $4.49, notes about $32, views writer $0.89; codex reports no cost.

## Not done

- **v2 runs.** The v2 condition reuses round-2 runs.
- **Hero-only traps.** T19 does not occur in the fresh Riverside, Lakeview or HomeLog data (hero-only in the generator). Lakeview T13 has 8 patients and is prose-only.
- **Uncorrected artifacts.** The fresh corpus keeps the referral-code inconsistency, and the cache keeps its frozen-key selection.
- **Value-set binding** checks against tx.fhir.org were not run.
