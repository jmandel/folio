# Stage 1 receipt (pilot)

Branch `stage1`. The full prose run for all 300 patients has not been done yet; it waits for a go-ahead.

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
