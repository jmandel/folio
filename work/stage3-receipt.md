# Stage 3 receipt

Branch `stage3`. Claim under test: from a source's `.d.ts` and a few sample items alone, a CLI coding agent
writes a deterministic mapper into consumer-defined views that is correct on held-out patients; independent
checks catch silent errors; passing mappers are cached by schema hash and run as plain code.

Short answer, on this corpus: yes for all three backends on structured facts, with a small number of
silent errors that are mostly policy calls the views did not settle. The full matrix ran: 4 sources ×
{claude opus, codex, claude sonnet} × conditions a/b/c on the app views, and 4 sources × {opus, codex} on US
Core. The cost was about $20, against a budget of $150. All numbers are in
[`results/stage3/SCORECARD.md`](../results/stage3/SCORECARD.md) and `scorecard.json`, and each one names its run ids.

## What exists

| Path | What it is |
|---|---|
| `packages/views/views.d.ts` | Consumer views with docstrings: `MedicationRow` (status incl. held/unknown, `status_since`, dose, `stop_reason`), `ProblemRow` (CKD G-stage), `AllergyIntoleranceRow` (allergy / intolerance / adverse_reaction), `LabResultRow` (analyte table with fixed units, eGFR rule, `egfr_equation`), `VitalRow`, and the `Transform` contract with `asOf`. |
| `packages/views/uscore.d.ts` | US Core target: MedicationRequest (chosen because US Core 3.1.1–7.0 profiles no MedicationStatement and represents reported meds with `reportedBoolean`), and lab Observation. |
| `packages/compiler/src/keys.ts` | Per-source expected views from the truth plus renderer knowledge, as of any date. Anti rows hold facts that must not appear. Also the merged key, restricted to what some source records. |
| `packages/compiler/src/{workdir,sandbox,compile}.ts` | Builds the workdir, runs the agent under bubblewrap, and runs conditions a/b/c (at most 2 feedback rounds). |
| `packages/compiler/src/{exec,evaluate,score,fhir}.ts` | tsc, contract scan, held-out execution with a determinism re-run, field-level scoring, trap attribution, US Core checks and the projection back to rows. |
| `packages/compiler/src/prose.ts` | Prose cross-check. Sonnet reads only the narratives: 30 dev items and 40 test items per source. |
| `packages/compiler/src/merge.ts` | Generic merge of rows across sources (about 70 lines). |
| `packages/compiler/test/` | Hand-written reference mappers for all four sources, plus scorer tests (9 pass). |
| `mappers/<schema-sha256>/<view-set-hash>/<backend-model>/` | 20 cached mappers, each with `provenance.json`. |
| `runs/compiler/…` | Every agent run, recorded: prompt, inputs, transcript and outputs. |

## How to run

```
bun run compile northgate --backend opus --condition a        # also: --views uscore, --workdir-only
bun packages/compiler/src/cli/matrix.ts                        # the whole matrix
bun run score                                                  # re-evaluates every round with current keys, writes SCORECARD.md
bun test packages/compiler/test
```

## Isolation

The agent CLI runs under `bwrap`. `$HOME` and `/tmp` are empty tmpfs mounts. Only these are mounted back:
the run dir, the CLI binaries, the CLI auth file, a fresh `~/.claude.json` and a read-only TypeScript.

The probe runs in `runs/compiler/isolation-probe/` checked this:

- `ls ~/hobby` shows only the empty mount path.
- `cat …/truth/TRAPS.md` fails with "No such file".
- `~/.claude` has no projects or history.

The Northgate workdir, which `bun run compile northgate --workdir-only` lists:

- `in/schema/northgate-chart-v1.d.ts`
- `in/views/views.d.ts`
- `in/samples/01…10-*.folio.md` and `samples.json`: 10 items from 2 training patients, named by their Northgate id
- `in/harness/{tsconfig.json,typecheck.ts,run.ts,check.sh}`
- `in/INSTRUCTIONS.md`

Patients are split by truth id into train (20%), dev (20%) and test (60%). The hero and secondaries are test. Samples come only from train.

## Is the scoring sane?

- **Reference mappers.** I wrote a mapper for each source from its schema. All four score 100% precision and recall against their keys: 47,410 fields for Northgate across 181 held-out patients.
- **Broken variants.** Each broken Northgate variant is caught on its trap:
  - ignoring supersedes and retracts (T3, T4)
  - reading a hold as a stop (T1)
  - platelets left unscaled (T7)
  - keeping the race-coefficient eGFR rows (T11)
  - padding year-only onsets to full dates (T17)
- **Keys corrected after triage.** Three times an agent disagreed with a key and the agent was the one right by the schema or view text:
  - The key needed one row per ingredient.
  - In HomeLog, a `taking` entry with the note "doctor told me to stop for now" is held.
  - In Riverside, a diagnosis of a drug-caused condition is also an allergy row.

  I fixed each key and the reference mapper, re-evaluated every round, and re-ran condition c where the old key had been fed back. Superseded c runs remain in `runs/` unreferenced.
- **Merge fixes after triage.** I changed the merge rule (latest evidence, clinician rows first) and restricted the merged key to facts and fields some source records.

## Results

Test split, field-level precision / recall, condition a (one-shot):

| Source | Opus | Codex (gpt-6-astra, xhigh) | Sonnet |
|---|---|---|---|
| Northgate (event log) | 100.0 / 99.9 | 100.0 / 99.9 | 100.0 / 99.5 |
| Lakeview (coded tables) | 100.0 / 100.0 | 100.0 / 100.0 | 100.0 / 100.0 |
| Riverside (documents) | 99.9 / 99.9 | 99.4 / 99.5 | 100.0 / 99.5 |
| HomeLog (patient app) | 100.0 / 100.0 | 99.6 / **3.4** | 100.0 / 100.0 |

- **Compiling.** Every run compiled. No mapper threw on a held-out patient, and all were deterministic.
- **US Core.** Opus and codex reach 100 / 100 on all sources (codex HomeLog 99.4), and all 23,952 resources each backend emitted are structurally conformant.
- **End to end.** The merged chart covers 184 test patients. Opus a scores 99.9 / 99.9, and so do the hand-written references, which set the ceiling at 100 / 100. Hero recall is 100% for Opus, and codex a has 15.6% hero recall because it emitted no home readings.
- **Speed.** Compiled mappers take 0.02–0.35 ms per item.
- **Agent time.** Opus takes 3–6 minutes per compile, Sonnet 1–3 and codex 10–17.
- **Spend.** In total: opus $14.39 over 16 runs, sonnet $3.05 over 14, prose $2.53 over 8, and 2.4 hours of codex agent time (codex reports no cost).

## The five most interesting silent errors

1. **Sonnet withheld behavioral-health data on its own (Northgate, T19, 30 of 30 facts).**
   - It drops every line with `restricted: "BH"`, e.g. hero sertraline `01DMXAJR8GTNM4Y0AKHSMSV93C` and depression `01DMXA2TG0PST203XFPBD0TA1G`.
   - The view says nothing about sensitivity, so this was a disclosure decision taken silently inside a mapper.
   - Prose feedback round 2 fixed it (`20261014T121327949Z-386m`).
2. **All three backends: no `ingredient` for RxNorm names with a pack prefix (Northgate, 31 rows each).**
   - The names are of the form "3 ML insulin glargine 100 UNT/ML Pen Injector", e.g. `01K2YTJFEGP8WKXSCRFXTGNCYM`.
   - Each parser stops at the leading number. The merge then shows glargine twice.
   - No feedback condition fixed it: the samples never show such a name.
3. **Codex dropped every home reading (HomeLog, 6,963 rows, T6 748/748).**
   - Example: hero `01GXT102J8HAJNV6TGVJ03EWFR`.
   - Its code comment says zone-less phone times cannot honestly be placed in America/Chicago.
   - This is a principled reading of a gap in my view. The prose check could not see it: 14 errors in scope, 0 flagged.
4. **Drug-caused diagnoses at Riverside (T18).**
   - Sonnet and codex one-shot made no allergy row from "Euglycemic DKA, SGLT2 inhibitor-associated" (hero `01JBZ2V178F5KZNWJ47TAN9ZT2`). Codex later named the substance "SGLT2 inhibitor" rather than the drug.
   - Opus typed ACE-inhibitor angioedema (s04 `01H24A8XZ0F0J4QQBRXSBKP21Z`) as `adverse_reaction`. My view lists angioedema under `allergy` and also says drug adverse effects are `adverse_reaction`. It contradicts itself, so count this against the view.
5. **Paused medicine left as `taking` (HomeLog, T1).**
   - Example: p139 Kerendia, `01KVP09G5RCC6G2AX0ZH51Y92V`, note "doctor told me to stop for now".
   - Sonnet and codex report it active. Opus reports held, which is the reading the schema's "no paused status" docstring supports.

## Did prose checking help?

A little, and noisily.

**Where it helped:**
- It fixed Sonnet's BH omission on Northgate (round 2).
- It raised Riverside allergy recall for Sonnet and codex from 31.4 to 42.9.
- On test items it confirmed 1 of 11 discrepancies for Sonnet on Northgate, and 4 of 11 for Sonnet and codex on Riverside.

**Where it fell short:**
- Most discrepancies are false alarms. Even for perfect mappers there were 10 on Northgate, 11 on Lakeview and 7 on Riverside. Typical causes:
  - notes citing a recomputed CKD-EPI 2021 eGFR while the lab printed 2009
  - labs resulted after the note
  - UTC dates
- One feedback round made a mapper worse. Sonnet moved ACE angioedema off the Riverside problem list (problems 100 → 90.2).
- It cannot see structured-only facts: codex HomeLog had 14 errors in scope and 0 flagged.

**Key feedback (c, calibration only).** It closed most remaining gaps. It did not fix the pack-prefix names, or Sonnet's angioedema typing.

## Documentation gaps the errors point to

- **Sensitive entries.** The views (and FOLIO) need to say whether restricted or sensitive entries are mapped, and to carry a `sensitive` flag. Withholding belongs to disclosure, not to mappers (error 1).
- **Northgate drug names.** The schema should say that `drug.name` is an RxNorm SCD/SBD name, with pack and timing prefixes, or carry an ingredient code (error 2).
- **Zone-less times.** The views must state how to place zone-less local times, e.g. "assume the patient's home zone, America/Chicago" (error 3).
- **Drug-caused diagnoses.** The views need one rule for a drug-caused diagnosis: problem, allergy row, or both, and which type for angioedema (error 4).
- **HomeLog paused medicines.** HomeLog would be clearer with a paused status. Failing that, the view should say that patient notes count toward status (error 5).
- **Lakeview DKA history.** Lakeview codes DKA history as Z86.39 "Personal history of other endocrine…", which no reader can link to DKA. This is a source-side quirk and it cost the merged chart in every run.
- **Doses in tablets.** The views should say whether a dose given in tablets is converted to mg using the strength. Mappers and the merge disagreed on ibuprofen.

## Open decisions for the gate

- Whether to fix the five view gaps above now, which would put the views at version 2 and require recompiling, or keep the views fixed until Stage 7's ablation.
- The corpus schemas document every trap, so with full docstrings silent-error rates are near zero. The interesting signal will come from Stage 7.
