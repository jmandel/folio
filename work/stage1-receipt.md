# Stage 1 receipt

Branch `stage1`. The full run is done (see [Full run](#full-run)); the pilot section below is kept as it was.

## What exists

| Path | What it is |
|---|---|
| `packages/agent-runner` | Runs a task through `claude -p` (stream-json) or `codex exec --json`, optionally inside tmux. Records `runs/<family>/<runId>/` (prompt, `in/`, `out/`, transcript, stderr, `meta.json` with timings, exit code and cost). Also a concurrency pool, timeouts that kill the process tree, retries, and `replay()`. 11 unit tests (fake backend) and smoke runs in `runs/smoke/`. |
| `packages/truth` | Truth model (deviations from MODEL.md are listed in its README), the hero, 4 secondaries, a seeded generator for 295 patients, and the answer keys: 7 views per patient plus 6 cohorts. |
| `packages/render` | Truth → items for all four sources, note requests, a deterministic validator, the prose step and ledger, and three CLIs: `bun run gen`, `bun run prose`, `bun run check:corpus`. |
| `corpus/` | 300 patients and 25,470 items (46 MB). Also `answers/` (per-patient views, `cohorts/`, `patients.json`), `MANIFEST.json` and `prose-ledger.json`. |

- **Golden fixtures.** The hero render reproduces all 31 examples exactly (payload, envelope, ids, narrative). Checked by `packages/render/test/golden.test.ts`.
- **Corpus check.** `check:corpus` finds 0 problems. All payloads type-check: tsc, 789 files, 0 errors. Hashes are current and ref spans are valid. Trap coverage matches MANIFEST: every trap is assigned and detected in 27–268 patients.
- **Cohort sizes:** CKD progression on an SGLT2i 15; SGLT2i DKA with a documented precipitant 11; confirmed hyperkalemia 41; insulin + uncontrolled DM + eGFR <45 16; masked hypertension 15; ACE-inhibitor angioedema 7.
- **Prose-only-fact patients:** 96.

## Pilot

The pilot used the 10 claude patients below plus 2 codex patients.

| Backend | Patients | Calls, (patient, source) | Notes | First pass | Retries | Cost | Agent time |
|---|---|---|---|---|---|---|---|
| claude, sonnet | hero, s01–s04, p016, p047, p076, p155, p217 | 24 | 265 | 260 (98%) | 4 | $1.75 | 18 s per call on average (max 47 s); 87 s wall at concurrency 6 |
| codex (from `~/.codex` config) | p013, p026 | 5 | 29 | 29 (100%) | 0 | not reported (~107k input tokens per call) | ~39 s per call |

Every note was accepted within one retry. Average claude cost and time per call, by source:

| Source | Cost per call | Time per call |
|---|---|---|
| Riverside | $0.088 | 25 s |
| Northgate | $0.089 | 20 s |
| Lakeview | $0.059 | 12 s |
| HomeLog | $0.030 | 7 s |

A first calibration pilot showed notes echoing machine wording. I fixed the request phrasing and re-ran the pilot from scratch; the numbers above are from that second run.

**Projected full run (claude sonnet):** 460 calls and 5,314 notes, about $28 and 1.75 agent-hours. That is about 20 minutes of wall time at concurrency 6.

## Notes to read

- `corpus/riverside/RRH-00731846/2024-11-04-progress-note.folio.md`: the hero, day-4 progress note.
- `corpus/riverside/RRH-00827796/2025-04-28-admission-hp.folio.md`: a population SGLT2i DKA admission H&P. Its precipitant exists only in the `precipitant` span.

## Spec, schema and story issues

1. Lakeview's code table has no BUN, chloride, bicarbonate or lipid tests. Outpatient labs are therefore limited to creatinine/eGFR, Na, K, glucose, A1c, UACR and CBC, and there is no LDL anywhere in the corpus. Adding tests means a new schema version.
2. HERO.md's "current problems" leaves out hyponatremia, but Lakeview's 2026-07-13 visit records E87.1 as active. The problem key includes it.
3. A Northgate visit note about a restricted (behavioral-health) diagnosis can only span that visit's restricted `billing_dx` entry. The README doesn't describe this pattern.
4. The spec allows one id on several spans; the hero's examples do this. The validator still requires each id exactly once in generated prose, as the brief asked.
5. The `homelog_med_id` values in the examples (Jardiance `med_8`, lisinopril `med_9`) mean she added those medicines only in 2026-03. The hero's list history follows that.
6. The RxNorm SCD codes for population drugs, and some LOINC/SNOMED codes, have not been checked against the terminology files.
7. codex reports no cost and reads `~/.codex/config.toml` (model, reasoning effort). claude runs with `--safe-mode --setting-sources=`, so user settings and CLAUDE.md are not loaded.
8. 5,022 items still carry template placeholder text until the full prose run.

## Full run

The pilot was approved, and the coordinator asked for these changes first:

1. **Lipids.** Lakeview's code table now has `LK-LIPID` with total cholesterol, TG, HDL and a calculated (Friedewald) LDL. Each code has a docstring, and the calculated LDL points at its source row through `DERIVED_FROM_RESULT_ID`. I recomputed the example hashes and the 31 examples still reproduce. LDL appears in the latest-labs key for 267 of 300 patients, and Northgate imports the lipid rows. The hero has one panel, on 2025-02-17.
2. **HERO.md.** Now lists hyponatremia, the lipid panel, the referral steps and the 2026-08-10 phone contact. The hero's keys now match HERO.md.
3. **Codes.** `work/verify-codes.ts` checks every distinct code against NLM (RxNav; Clinical Tables for LOINC and ICD-10-CM) and writes `work/code-verification.json`. It covers 73 RxNorm, 26 LOINC and 26 ICD-10-CM codes; all now pass.
   - Fixed seven wrong RxNorm SCD codes: losartan 50, dapagliflozin 10, empagliflozin 25, valsartan 160, atorvastatin 80, insulin lispro and insulin detemir pens.
   - Fixed five names to the official RxNorm form.
   - Five codes are accepted with a reason. Two are the deliberate MDRD LOINCs (T11). Three are synonyms or local labels.
   - SNOMED codes are not checked.
4. **Prose.** Run with claude (sonnet) at concurrency 6, resumable; results in the table below.
5. **Merge.** `main` (Stage 2) is merged; both sets of `package.json` scripts and dependencies are kept. `bun test` passes 239 tests, 3 skipped. `check:corpus` finds 0 problems: 25,372 items, tsc 0 errors, all 5,283 notes re-validated, 0 templates left.
6. **Signing.** `bun run sign` signs `corpus/` into the git-ignored `build/signed/` with seeded salts in about 10 s. Two runs give byte-identical output. Sync nodes now serve pre-signed `.folio.sd-jwt` files without re-signing, and the node CLI defaults to `build/signed` when it exists. The personal agent synced the hero from the four local nodes: 466 items, 0 rejected.

| | Prose run |
|---|---|
| Calls | 449 |
| Notes | 5,197 |
| Accepted first pass | 99.8% |
| Retry calls | 8 |
| Accepted in total | 100% |
| Cost | $27.55 |
| Agent time | 1.64 h |
| Wall time | 16.8 min |

The corpus now has 25,372 items, all with final narrative (no template placeholders). It is 52 MB; `runs/` is 17 MB.
