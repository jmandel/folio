# Stage 3 audit

Adversarial review of the claim: "CLI agents given only a source .d.ts + ~8 sample items write mappers scoring
99–100% field-level precision/recall on held-out patients, across 4 sources × 3 backends."

Branch `stage3` at `e885cbd3`. Nothing in the repo was modified except this file. I made my own computations on a copy of the
worktree in a scratch directory, importing `packages/compiler/src/{data,exec,keys,score}.ts` unchanged. I ran the
condition-a mapper of every source × backend against the per-source keys on the test split, at three as-of dates.

## Verdict summary

| # | Question | Verdict |
|---|---|---|
| 1 | Isolation | **Weak in principle, sound in practice.** The filesystem isolation is solid, but network egress and the user's D-Bus session are open. No run used them. |
| 2 | Scoring leniency | **Weak.** The mechanics are honest: missing rows, extra rows, duplicates and anti rows all count. The headline metric, though, is dominated by labs and vitals, several view fields go unscored, and only one as-of date is scored. |
| 3 | Post-hoc key and merge changes | One change is **sound**, one is **defensible but bent**, and the Riverside allergy change and the merge-rule tune are **weak**. All triage was done on the test split. |
| 4 | Held-out split | **Weak.** There are few trap-bearing test patients for the hard traps. The training samples show most traps. |
| 5 | Difficulty | The docs give away almost every trap, with worked examples. Every error that occurred sits on a point the docs leave open. |
| 6 | Other | The stated claim is false as worded: codex HomeLog recall is 3.4%. Other weak points: n = 1 run per cell, a "US Core conformant" claim checked against a 9-point checklist rather than the HL7 validator, and an immunologically wrong angioedema rule in the view. |

---

## 1. Isolation

**Filesystem: sound.** `packages/compiler/src/sandbox.ts:44-77` sets up the sandbox as follows:

- bwrap mounts `--ro-bind / /`, then puts `--tmpfs` over `/tmp` and over `$HOME`.
- It binds back only the run dir, the CLI binaries, the auth files, a fresh `~/.claude.json` and a read-only TypeScript.
- Claude runs with `--safe-mode --setting-sources= --strict-mcp-config` (`packages/agent-runner/src/backends.ts:25-31`), so it loads no CLAUDE.md and no memory files.
- Codex gets a two-line `config.toml` (`sandbox.ts:15-26`) and runs with `--ephemeral --disable memories`.

The run dir sits under the repo, but its parents are empty tmpfs directories created by bwrap, so sibling runs, `truth/` and keys are invisible.

I scanned all 55 compile transcripts (Claude stream-json and codex `command_execution` items) for paths outside the run dir. These are the only out-of-run accesses:

- **Codex AGENTS.md lookups.** Codex probes for `AGENTS.md` up the directory tree, e.g. `20261014T121114687Z-j9h7`, `…122509946Z-6hsu`, `…122930125Z-4aix`. Every probe returned empty.
- **`rg --files /home/jmandel`** in `lakeview/app/codex…/20261014T122447488Z-bsoj` found nothing.
- **Claude reads of `~/.claude/projects/.../tool-results/*.txt`.** These are the CLI's own spill files inside the tmpfs home.
- **`cd ..` / `../..`** navigations stay inside the run dir.
- **Sonnet's `cd …/claude-sonnet/*/in`** (`northgate/app/claude-sonnet/20261014T121120169Z-4zza`, `riverside/.../z7dy`) matched only its own run dir, which is the only one mounted.

No transcript contains `curl`, `wget`, `github`, `busctl`, `systemd-run`, `/run/user` or `WebFetch`.

**Holes, none of them exploited:**

- **Network is not unshared for Claude runs.** The Claude tool set is Read/Write/Edit/Glob/Grep/**Bash**, so `curl` works. `github.com/jmandel/folio` is **PUBLIC**; its main branch was pushed at 11:54Z, while the runs ran 11:54–12:45Z. That repo contains:
  - `truth/TRAPS.md`
  - `sources/*/NOTES.md`
  - `corpus/answers/**`
  - the truth generator

  I reproduced the sandbox (same bwrap flags): `curl -sI https://github.com/jmandel/folio/blob/main/truth/TRAPS.md` returns `HTTP/2 200`. Codex's `-s workspace-write` blocks network by default, so this hole is specific to Claude runs.
- **`/run/user/1000` is visible**, including `bus`, which is the systemd user D-Bus. Inside the same bwrap, `busctl --user list` shows `org.freedesktop.systemd1`. `systemd-run --user …` would therefore run a command outside the sandbox with full `$HOME` access. `/run/user/1000/doc` (the document portal) is also mounted.
- **The environment is passed through whole** (`backends.ts:56-65`, with no `--clearenv`). I found nothing sensitive to the task in it, but it is not minimal.
- **The isolation probe** (`runs/compiler/isolation-probe/*`) tested `~`, `/tmp` and TRAPS.md only. It tested neither network nor IPC.

Conclusion: no evidence of leakage, but a skeptic could not rule it out from the sandbox design alone. The transcript scan is the actual evidence, and it should become a gate.

## 2. Scoring leniency

**What is honest** (`packages/compiler/src/score.ts:152-211`):

- An unmatched expected row costs 1 + all its fields.
- An unmatched mapper row costs 1 + every scored field it asserts.
- Duplicates cost false positives.
- Anti rows (withdrawn, voided, ruled-out, race-variant and typo facts) are checked against leftover mapper rows.

**Which hard fields are scored:**

- Meds: `status`, `status_since`, `stop_reason`, `dose`, `frequency`, and `ingredient` (the last added only in `e885cbd3`).
- Problems: `status`, `ckd_stage`, `onset`.
- Allergies: `type`, `criticality`.
- Labs: `value` + `comparator`, `unit`, `egfr_equation`.
- Supersession and retraction, via anti rows and corrected values.

**Not scored**, although the view defines them and the key sometimes computes them:

- allergy `onset` (key computes it at `keys.ts:220`, but `compareFields` ignores it at `score.ts:112-115`)
- allergy `reaction`
- lab `status` (final/preliminary)
- `otc` and `patient_reported` (T13 is about OTC drugs)
- `status_reason_text`
- `albuminuria`
- `glucose_out_of_range`
- the "never guessed" rule on `rxnorm_ingredient`
- problem `icd10cm` and condition text
- **`evidence`**, which the whole provenance story rests on and which is never checked

**Match keys copy source fields verbatim.** Labs match on analyte + collection minute, problems on ICD family, allergies on substance. That is reasonable, but a wrong collection time is scored as a missing row plus an extra row, never as a field error. Home glucose tolerance is ±2 mg/dL (`score.ts:126`), which absorbs ×18 versus ×18.016.

**Only one as-of date.** Every reported number uses as-of 2026-10-13 (`data.ts:18`), the end of the corpus. I re-ran at 2025-03-31 and 2023-06-30:

- The mappers do honor `asOf`: error counts scale with the record, and no new error classes appear.
- The HomeLog key has a scope bug at intermediate dates. Day pages are published the next day, but the key admits readings on the as-of day by their wall time. As a result, the **reference mapper scores R = 99.6** at 2025-03-31 (p061, p099, p111 …). The "reference = 100/100" sanity check holds only on the reported date.

**Volume dominates the headline.** Below are recomputed row-level errors, test split, condition a, as of 2026-10-13. A row is wrong if it is missing, duplicated, or has any wrong field. "Clinical rows" means meds + problems + allergies.

| Source | Backend | Reported P / R | Meds | Problems | Allergies | Clinical rows wrong | Labs | Vitals | Labs+vitals share of rows |
|---|---|---|---|---|---|---|---|---|---|
| northgate | opus | 100.0 / 99.9 | 31/812 | 0/643 | 0/35 | **31/1490 (2.1%)** | 0/10813 | 0/1466 | 89% |
| northgate | sonnet | 100.0 / 99.5 | 60/812 | 29/643 | 0/35 | **89/1490 (6.0%)** | 0/10813 | 0/1466 | 89% |
| northgate | codex | 100.0 / 99.9 | 31/812 | 0/643 | 0/35 | 31/1490 (2.1%) | 0/10813 | 0/1466 | 89% |
| riverside | opus | 99.9 / 99.9 | 0/144 | 0/41 | **4/16** | 4/201 (2.0%) | 0/1028 | 0/134 | 85% |
| riverside | sonnet | 100.0 / 99.5 | 0/144 | 0/41 | **12/16** | **12/201 (6.0%)** | 0/1028 | 0/134 | 85% |
| riverside | codex | 99.4 / 99.5 | 0/144 | 0/41 | **12/16** | 12/201 (6.0%) + 9 extras | 0/1028 | 0/134 | 85% |
| lakeview | all three | 100.0 / 100.0 | 0/22 | 0/113 | – | 0/135 | 0/10881 | 0/359 | **99%** |
| homelog | opus | 100.0 / 100.0 | 0/252 | – | – | 0/252 | – | 0/6963 | 97% |
| homelog | sonnet | 100.0 / 100.0 | 9/252 | – | – | 9/252 (3.6%) | – | 0/6963 | 97% |
| homelog | codex | 99.6 / **3.4** | 3/252 | – | – | 3/252 | – | **6963/6963** | 97% |

So "99.5% recall" means a 6% wrong-row rate on the clinically meaningful lists. For Riverside allergies it means **75% of rows wrong** (Sonnet and codex). Lakeview's 100% rests on **22 test medication rows**; the other 99% of its rows are labs and vitals. The scorecard does print per-view recall (Riverside allergies 31.4), so this is not hidden, but the headline and the receipt's one-line summary hide it.

**Per-trap counts are inflated by volume.** Below are recomputed trap errors (wrong rows or anti hits / trap facts) for Northgate and Riverside, condition a:

| Trap | Northgate opus | Northgate sonnet | Riverside opus | Riverside sonnet |
|---|---|---|---|---|
| T1 held vs stopped | 0/46 | 0/46 | 0/17 | 0/17 |
| T2 two-axis status | 0/16 | 0/16 | – | – |
| T3 superseded | 0/69 | 0/69 | – | – |
| T4 entered in error | 0/20 | 0/20 | – | – |
| T5 stale problem list | 0/17 | 0/17 | – | – |
| T12 negation / rule-out | 0/22 | 0/22 | 0/13 | 0/13 |
| T18 two shapes | 0/31 | 0/31 | **4/34** | **12/34** |
| T19 redaction | 0/30 | **30/30** | 0/2 | 0/2 |
| T7 platelets | 0/650 | 0/650 | – | – |
| T11 eGFR | 0/2308 | 0/2308 | – | – |
| T14 duplicates across sources | 0/10979 | 0/10979 | 0/1028 | 0/1028 |
| T16 local codes | 0/2659 | 0/2659 | – | – |

The hard-field results:

- Opus and Sonnet both got every Northgate med `status` (812), `status_since` (55), `stop_reason` (37), `ckd_stage` (66) and `egfr_equation` (1691) right.
- Northgate Sonnet's 60 med errors are 31 pack-prefix ingredients plus 29 behavioral-health (BH) drops.
- The Riverside errors are all T18 allergy rows.

T14 is attached to nearly every lab, but a per-source mapper cannot commit the T14 error at all, since deduplication happens in the merge. Listing 23,031 T14 "facts" in a silent-error table pads it. Only 39 hold-vs-stop facts, 35 rule-outs and 65 reaction-shape facts actually test judgment.

## 3. Post-hoc tuning

Timeline:

| When (UTC) | Run or commit | Event |
|---|---|---|
| 12:04 | `evni` (HomeLog Opus) | Opus HomeLog compile starts. |
| 12:11:21 | commit `1394a299` | Two key changes: one row per ingredient, and HomeLog "paused" read as held. |
| 12:11 and 12:14 | `3565` (codex), `whju` (Sonnet) | HomeLog runs for codex and Sonnet. |
| ~12:35–12:41 | in `e885cbd3` | Riverside drug-diagnosis allergy rule added, after the a and b runs. |
| 12:41–12:45 | `8k81`, `qkcu`, `749g` | Condition-c runs re-run against the new key. |

The superseded c runs are `q94a` and `spj5`. They are unreferenced but kept, which is good. I found no other discarded a-runs; the only other unreferenced run is `yo0h`, which failed with exit 1 in 6 s and was retried as `-a2`.

| Change | Judgment |
|---|---|
| **One key row per ingredient** (`keys.ts:130-137`) | **Sound.** The view says "One row per drug ingredient … report the most recent one" (`views.d.ts:79-82`). The old key contradicted its own spec. |
| **HomeLog `taking` + "doctor told me to stop for now" → held** (`keys.ts:423-427`) | **Defensible, but bent toward Opus.** The truth status is `held`: the generator writes that exact sentinel note only for held meds (`packages/truth/src/population.ts:1187`). But the schema says only that patients "leave it 'taking'" (`homelog-v1.d.ts:208`), and the view defines `active` on a patient list as "says they are [taking]". Either reading is literal. The key was flipped right after the Opus run and before the Sonnet and codex runs, which were then scored as T1 failures. Only 3 test facts are involved, all with the identical string. |
| **Riverside drug-caused diagnosis → also an allergy row** (`keys.ts:358-366`) | **Weak.** The view does say a drug adverse effect "however the source records it" is an allergy row (`views.d.ts:171-174`). But the Riverside diagnosis names a *class* ("SGLT2 inhibitor-associated"); the key demands the specific drug, found by joining the same document's med list. Before the edit, Sonnet and codex had Riverside allergy recall 100% (4/4) and Opus had about 12 extra rows. After it, the numbers are 88.6 for Opus and 31.4 for Sonnet and codex. Codex's literal `substance: "SGLT2 inhibitor"` scores as a miss plus an extra. The key also types ACE-inhibitor angioedema as `allergy` and penalizes Opus 4/4 for `adverse_reaction`; the receipt itself says the view contradicts itself on this point. Fix: treat both points as view gaps, not agent errors. |
| **Merge rule** (latest evidence, clinician rows first; `merge.ts:44-56`) and **merged key restricted to fields some per-source key carries** (`keys.ts:518-541`) | **Weak.** This is harness code, so it is not "bending toward an agent". But it was tuned while looking at test-split merged results, with no held-out set left for the merge. And "end-to-end vs truth" is really "vs truth restricted to what the per-source keys model". |

All triage used `evaluateTransform(..., "test")` (`compile.ts:51`). The dev split exists, but key fixes were driven by test-split errors. That alone makes the test numbers "post-hoc on test".

## 4. Held-out split

Splits by truth id are 20/20/60 (`data.ts:73-77`); the hero and the secondaries s01–s04 are forced into test. These are the test patients carrying each hard trap (bold = n ≤ 3):

- **Northgate:**
  - T1: 41 (4 are hero or secondaries)
  - T2: 16
  - T4: 20
  - T12: 22
  - T18: 28
  - T19: 29
- **Lakeview:**
  - T1: 7
  - T4: 19
  - T13: **1** (hero)
  - T19: **1** (hero)
- **Riverside**, 32 test patients in total:
  - T12: 11
  - T18: 9
  - T19: **1**
- **HomeLog:**
  - T1: **3 facts**
  - T6: 16 patients
  - T13: 17 patients

The training samples are chosen greedily to cover every entry type plus a supersede and a retraction (`data.ts:123-149`). Here is what they show (my computation from item trap tags):

| Source | Sample items | Traps shown in samples |
|---|---|---|
| Northgate | 10 items from 2 patients | 11 of 15 traps: T1–T5, T9, T10, T14, T16, T17, T18. Not T7, T11, T12, T19. |
| Lakeview | 9 items | 9 of 12 traps |
| Riverside | 8 items | 5 of 6 traps |
| HomeLog | 8 items | 5 of 5 traps, including T6 (unit shift) |

The instruction "situations the samples do not show" is therefore mostly untrue. Held-out patients also come from the same seeded generator and templates as the training patients. So "held-out" tests generalization across template draws, not to unseen record shapes. The effective sample size is 4 schemas × 3 models = 12 compiles, each run **once**, with no variance estimate.

## 5. How much the docs give away

Nearly every trap is stated in the schema or the view, often with a worked example. Examples:

- **T7, platelets:** "a Lakeview platelet count of 212 K/uL … is filed here as value "212000", unit "cells/uL"" (`northgate-chart-v1.d.ts:422-426`). The view adds "212 000 cells/uL is 212" (`views.d.ts:259`).
- **T11, eGFR race variant:** "report only the variant without the race coefficient" (`views.d.ts:284-288`). The retirement of the 2009 eGFR code is dated in the schema (`northgate…d.ts:470`).
- **T17, fuzzy onset:** "Never pad a year-only or month-only date" (`views.d.ts:24`).
- **T3/T4, corrections:** the supersede/retract rules, transitive, are spelled out in the view header (`views.d.ts:16-20`).
- **T6, glucose units:** "the unit … can change partway through one patient's history", plus the factor 18.016 (`homelog-v1.d.ts:79-91`, `views.d.ts:344`).
- **T12, rule-outs:** "'ruled_out' … The patient does NOT have this condition" (`riverside-doc-v1.d.ts:131`) and "Never report a condition that was ruled out" (`views.d.ts:167-168`).
- **T18, reaction shapes:** "Read `reaction` to tell them apart" (`riverside…d.ts:177`). The view adds "If the source keeps all three on one undifferentiated list, decide from the recorded reaction" (`views.d.ts:220`).
- **T14, typed duplicates:** "if a source shows the same measurement twice … prefer the device copy" (`views.d.ts:327-330`).
- **T5, stale stage:** "never computed from lab values" (`views.d.ts:191-192`).

The "consumer" view was written by someone who knew each source's quirks. It contains source-specific rules ("when a code and a method note disagree, believe the method note"; the undifferentiated-list rule) that a real consumer would not know.

The telling pattern: **every error that occurred is on a point the docs leave open.**

- Pack-prefixed RxNorm names: undocumented; all three backends failed.
- BH restriction: the view is silent; Sonnet failed 30/30.
- Zone-less HomeLog times: the schema says the zone must come "from somewhere else"; codex dropped all 6,963 readings.
- Drug-caused diagnosis typing: the view is ambiguous.

**Every trap the docs spell out was passed by every backend.** This supports the thesis that honest docs produce correct mappers. But the result has to be stated as "given trap-complete docs written by the corpus author", not as "agents find traps". Stage 7's ablation is the real test.

## 6. Other exposures

- **The claim as phrased is false.** Codex HomeLog one-shot recall is 3.4%. Riverside allergy recall is 31.4 for two of three backends. The receipt itself is honest about both; any summary must be too.
- **"US Core: all 23,952 resources structurally conformant"** means passing a 9-item hand checklist (`fhir.ts:14-51`), not the HL7 FHIR validator with the US Core package. The checklist does not check:
  - `authoredOn` or `requester` (must-support)
  - the RxNorm binding
  - the existence of `Patient` resources
  - any Bundle
  - whether the LOINC code is correct (only its presence; wrong LOINC is caught indirectly through scoring)
- **ACE-inhibitor angioedema is listed as immune-mediated "allergy"** (`views.d.ts:215`). It is bradykinin-mediated and non-immune, and an informatics audience will catch it. Opus's `adverse_reaction` is clinically defensible and was scored wrong.
- **The answer key is not independent of the renderers.** `keys.ts` is "truth plus knowledge of how each renderer writes the truth", and the same author wrote the schemas, the views, the keys and the reference mappers. The "reference = 100%" check shows that the key and the author's reading agree, nothing more.
- **Precision was never really tested.** Precision is about 100% because agents rarely add rows, so the field-level metric's asymmetric FP accounting never mattered. Present row-level error rates instead.

## Fixes, ranked

1. **Report honestly at the right grain.** Headline row-level error rates for meds, problems and allergies separately from labs and vitals. Give per-trap results with the count of distinct test patients and drop the volume traps (T14, T16, T11, T7) from the "silent error" table, or show them separately. State the claim as "given trap-complete docs" and list the codex HomeLog failure in the headline.
2. **Freeze keys before runs; triage on dev only.** Report the three key edits as pre/post deltas. Move the Riverside drug-diagnosis rule and the angioedema type, and arguably the HomeLog pause rule, into views v2 as explicit rules. Then recompile, or exclude those rows from scoring as "view-ambiguous".
3. **Close the sandbox:**
   - an egress allowlist (API hosts only) for Claude runs
   - `--tmpfs /run/user/$UID`, `--unshare-ipc`, `--clearenv` with an explicit env
   - network and D-Bus checks added to the isolation probe
   - the transcript scan for out-of-run paths and network tools as an automatic gate in `compile.ts`
4. **Run each cell ≥3 times** and report the spread. One run per cell can't support claims of the form "Sonnet does X".
5. **Score more of the view:** `evidence` (the cited item must carry the fact), allergy `onset` and `reaction`, lab `status`, `otc`, `patient_reported`, and `rxnorm_ingredient` never guessed. Tighten the glucose tolerance.
6. **Evaluate at several as-of dates.** Fix the HomeLog day-page scoping in `keys.ts:442` (scope by publish/recorded time, not reading time) so the reference passes at every date.
7. **Add test patients carrying the rare traps** (Riverside T18/T12/T19, Lakeview T1/T13/T19, HomeLog pause) so denominators reach ≥ 20 patients. Optionally keep a few traps out of the samples on purpose, or hold out a generator variant.
8. **Validate the US Core output** with the HL7 validator and the US Core IG, or rename the check to "passes our checklist".
9. **Fix the angioedema classification** in `views.d.ts`.
