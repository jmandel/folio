# Stage 3 receipt (round 3)

Branch `stage3`. Round 3 answers the audit that blocked round 2 (the auditor's report is summarized in the
coordinator's brief; the round-2 audit is [`stage3-audit.md`](stage3-audit.md)). All numbers are in
[`results/stage3/SCORECARD.md`](../results/stage3/SCORECARD.md) and `scorecard.json`; every number there names run ids
or files. Round 1 and round 2 results are kept in `results/stage3/round1/` and `round2/` and are not used.

## What changed

1. **Truth and keys** (`work/decisions.md`, "Stage 3 round 3"; commit `ffef1875`, then `068503e5`). Each change was checked against the regenerated raw items.
   - **HomeLog levothyroxine.** The strength text now uses the product's unit ("75 mcg").
   - **Restarts after a reaction.** No patient is restarted on a drug, or a drug of the same class, after an adverse reaction. This was p218's empagliflozin after DKA; ACE inhibitors are now stopped from a planned angioedema.
   - **Duplicate lines.** The duplicate medication lines behind the duplicate active-meds answers are gone (s04 amlodipine, p104 dapagliflozin).
   - **Plausibility check.** `buildTruth` checks these rules on every build. Implausible population patients are regenerated from a derived seed.
   - **Prose-only status.** In the merged key, a status that no structured record carries is reported as prose-only, not as a wrong row.
   - **Underdetermined cases** are now written into views v3 and the scorer:
     - "nightly" is accepted as QHS or QD;
     - no dose is expected without directions;
     - a patient list that names one drug twice with different statuses is not scored.
   - **Notes.** 165 + 3 changed notes were regenerated with the Stage 1 note pipeline.
2. **Views v3, written blind** (`work/views-v3/`, run `20261014T151559955Z-roja`).
   - **Inputs.** A fresh sandboxed Opus agent got only a brief of output semantics in generic words, and the v2 types with all comments removed. It never saw sources, corpus, truth or the generator. The types came out byte-identical.
   - **Example revision.** A second blind run (`20261014T151839328Z-up74`) replaced two examples that named drugs coinciding with corpus cases: ibuprofen 200 mg × 2, and sertraline. It was told only those two names.
   - **Leak check.** `cli/leakcheck.ts` ran `rg -F` for every quoted string and number-with-unit against sources/, the generator, the renderers and the corpus. The only matches are the skeleton's own field values and analyte names, generic terms, and arithmetic examples.
   - **v2 is kept** as the "views with source hints" condition (`packages/views/v2/`).
3. **Fresh held-out cohort.**
   - **Freeze.** Key and scorer code were frozen at hash `26ee28163e5c6e69` before the cohort was generated.
   - **Cohort.** `corpus-fresh/`: 180 patients, seed `folio-stage3-fresh-final`, ids f001…, with trap-targeted quotas (`packages/truth/src/cohort.ts`). Notes come from the same pipeline (about $32).
   - **Not looked at.** I looked only at aggregate trap counts, to size the cohort; I didn't triage on it. An earlier seed was used to debug generator plausibility and is not used.
   - **Secondary table.** The old test split is reported only as a secondary table.
4. **Runs.**
   - **Compiles.** All compile on the main corpus (training samples, dev-split evaluation for the cache gate). Then each mapper is scored once on the fresh cohort at three as-of dates, with 2026-10-13 primary.
   - **Views v3, condition a:** 3 runs each for Opus, codex and Sonnet, all four sources.
   - **Docs ablation:** full schema vs types-only, Opus, 3 runs each, all four sources.
   - **Views v2:** Opus, 3 runs per source. These reuse the three round-2 Opus one-shot runs (views v2, compiled before round 3) to stay within budget; they are not new compiles.
   - **Outcome:** all 60 mappers type-check, run without exceptions on every fresh patient and date, and are deterministic.
5. **Other fixes.**
   - **Validator.** It now stores every issue (no cap), checks terminology against tx.fhir.org (`-txCache` in `build/`), and reports terminology errors apart from structural ones.
   - **Cache gate.** A cached mapper must also have (wrong + extra) / rows < 1% in every view on the main dev split. This was set and recorded before any held-out run; 9 mappers pass.
   - **Prose check.** The prose cross-check is dropped from the scorecard.
   - **Codex probe.** A codex probe with codex's own command sandbox off inside bwrap (`runs/compiler/isolation-probe-v2/codex-nosandbox/`) shows github.com refused at the proxy (403, logged DENY) and chatgpt.com tunneled through it (ALLOW).
   - **Footnotes.** The stratification and trap footnotes are now computed from the data.

## Headline: views v3, one-shot, fresh cohort, 2026-10-13

Wrong-row rate in percent: mean (min–max) over 3 runs; `+n` is extra rows in the worst run.

| Source | View | rows | Opus | codex | Sonnet |
|---|---|---|---|---|---|
| Northgate | medications / labs / vitals | 1015 / 13126 / 1664 | 0 | 0 | 0 |
| Northgate | problems | 724 | 0.0 | 3.0 (0.0–4.6), +33 | 0.0 |
| Northgate | allergies | 87 | 13.0 (0.0–19.5) | 19.5 | 19.5 |
| Lakeview | all four views | 31 / 181 / 13411 / 500 | 0 | 0 (+1 extra problem) | 0 |
| Riverside | medications / vitals | 549 / 487 | 0 | 0 | 0 |
| Riverside | problems | 119 | 0.0 | 0.0 | 4.8 (0.0–14.3) |
| Riverside | allergies | 77 | 0.0 | 0.0, +15 | 4.8 (0.0–14.3) |
| Riverside | labs | 3736 | 0.0 | 0.0 | 0.9 (0.0–2.6) |
| HomeLog | medications | 463 | 1.2 (0.0–3.0) | 8.1 (6.0–9.1) | 3.9 (2.8–6.0) |
| HomeLog | vitals | 10663 | 0 | 0 | 0 |

## What the errors are (from the Fields and Traps tables, not from triage on the fresh cohort)

- **Northgate allergies: a conflict between the frozen key and the source's own documentation.** Every backend reports `mechanism: "immune"` for entries Northgate types `allergy`. Northgate's schema defines that type as immune-mediated, and views v3 say "immune when the source says so". The frozen key accepts only `non_immune`/`unknown`, because the truth knows no immune-mediated reaction. I found the cause on the main dev split (same pattern, 2/10 rows); I did not change the frozen key. The scorecard says so, and the Fields table shows `allergies.mechanism` 890/972 (Opus) and 849/972 (codex, Sonnet).
- **Northgate problems, codex:** year-only onsets read wrongly (`problems.onset` 5890/6012; T17 102/2295), plus extra rows.
- **HomeLog medications:**
  - paused-by-note entries not read as held (T1: Opus 19/51, codex 34/51 facts)
  - OTC medicines (T13: codex and Sonnet 42/84)
  - a few ingredient and dose misses
- **Riverside, Sonnet only:**
  - one run's problems and allergies (T18 28/915)
  - lab rows in another run

## Views v2 vs v3, and the documentation ablation (Opus)

- **v2 vs v3.** With v2 (source hints) every view is at 0 wrong rows. With v3, Northgate allergies are at 13.0% (the mechanism conflict above) and HomeLog medications at 1.2%. Everything else is the same.
- **Ablation, types-only schema vs full schema (views v3):**
  - Lakeview labs: 1.9% in all three runs (full: 0)
  - Riverside allergies: 7.4% (0–22.1); medications 0.7%
  - Northgate allergies: 18.4% (0–55.2) vs 13.0%; vitals 0.1%
  - HomeLog: no difference

  That is the extent of what this shows the docs carry, with these views and samples.

## Merged chart (fresh cohort)

The hand-written reference mappers give 1.2% wrong medication rows with 12 extra rows; these are record limits. The one prose-only medication row is not counted as wrong. The three backends give 1.4–7.6% medication rows wrong, and 12.6% allergy rows wrong in most runs. The allergy errors are the Northgate mechanism conflict carried through the merge.

## US Core

I validated the round-2 US Core mappers on 25 fresh patients per source (scorecard, US Core section; every issue is kept in `results/stage3/fhir/fresh-<runId>.json`).

- **Structure and profile:** the HL7 validator, with terminology offline. 1 error each in Northgate Opus and Riverside Opus (a duplicate `fullUrl`); 0 elsewhere.
- **Terminology:** every distinct code checked with tx.fhir.org `$validate-code`.
  - Northgate, Lakeview and HomeLog have 0 invalid codes.
  - Riverside has 2 invalid codes, both prescribed by my `uscore.d.ts`: LOINC 53060-9, and "mmHg" where UCUM is `mm[Hg]`.
  - There are display-name mismatches: 13 in Riverside, 2 in Lakeview Opus.
- **Value-set binding:** not completed. Run through the validator against tx.fhir.org, it took more than 15 minutes per 40 resources.
- **Engine exceptions:** the validator's own calls to tx.fhir.org timed out on Northgate (35 per run). They are counted apart and are not findings about the resources.

## Isolation

The transcript scan covered 187 runs. No compile run made a network, IPC or web-tool call. The blind views writer ran `npx -y tsc` once, and the proxy refused the package download (2 denied connections to registry.npmjs.org). Every other denied connection was the codex CLI's own traffic. The scan now also flags `npx`, `bunx` and package installs.

## Cost

| Item | Cost |
|---|---|
| Opus compiles (24 new) | $36.35 |
| Sonnet compiles (12) | $4.49 |
| Codex compiles (12) | not reported |
| Notes | about $32 |
| Views writer | $0.89 |
| **Total** | **about $74** |

## What I could not do

- **The Northgate mechanism conflict stays in the headline.** It is a frozen-key problem. Fixing it after seeing fresh-cohort numbers would be triage on the held-out set, so it is reported, not corrected.
- **The v2 condition reuses round-2 runs.** They are not new compiles, to stay within budget.
- **Some traps don't reach 10 fresh patients, or any.** Lakeview T13 (8; a prose-only fact no view row carries) and T19 in Riverside, Lakeview and HomeLog (0): the generator places those cases only on the hero.
- **Value-set binding was not checked against tx.fhir.org**, because it was too slow through the validator. Codes were checked individually instead.
- **The US Core view prescribes two invalid codes** (LOINC 53060-9, and "mmHg" as UCUM). I have not fixed it, because the US Core mappers were not recompiled in round 3.
