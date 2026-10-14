# Stage 3 receipt (round 2)

Branch `stage3`. This round reworks Stage 3 after the audit in [`stage3-audit.md`](stage3-audit.md). The claim under
test: given a source's `.d.ts` and about eight sample items, a CLI agent writes a deterministic mapper into
consumer-defined views that is correct on held-out patients, and passing mappers are cached by schema hash.

The full numbers are in [`results/stage3/SCORECARD.md`](../results/stage3/SCORECARD.md) and `scorecard.json`;
every number there names its run ids. Round-1 results (views v1, keys changed after triage on the test split)
are kept in `results/stage3/round1/` and are not used.

## What changed since round 1

### Isolation

- **No network except the model APIs.** Agents now run under bubblewrap with `--unshare-net`. The only way out is a per-run CONNECT proxy, running in a separate process, which allows only the model API hosts and logs every connection (`packages/compiler/src/egress.ts`, `sandbox.ts`).
- **Nothing else reachable.** `$HOME`, `/tmp` and `/run/user` are empty mounts. The environment is cleared. IPC, PID and UTS namespaces are private. Claude's web tools are disallowed.
- **Probe runs** are kept in `runs/compiler/isolation-probe-v2/{claude,codex}/`. They show:
  - github.com is refused (403 at the proxy; no DNS directly)
  - the model API answers only through the proxy
  - the repo, `~/.claude/projects` and the D-Bus session can't be reached
- **Transcript scan.** `packages/compiler/src/scan.ts` checks every tool call for paths outside the run dir and for network, IPC or web tools. It covered all 136 recorded runs, rounds 1 and 2:
  - **Agent calls:** 0 network-tool, IPC or web-tool calls.
  - **Denied connections:** 397, all from the codex CLI itself (ab.chatgpt.com and an image CDN).
  - **Out-of-run paths:** 392 path mentions. I checked them by hand. They are codex looking for `AGENTS.md` up the directory tree, `cd ..` inside the run dir, and globs over the empty parent mount.
- **Gate.** The compile loop applies the same scan as a gate. It rejected one round-2 run (`20261014T142410689Z-3cbh`) because a heredoc body matched a tool name. I fixed the scanner, and `cli/regate.ts` reinstated that run; its record says so.

### Keys

- **Judge.** A separate Opus agent judged the three round-1 key changes (`results/stage3/key-judge.md`, run `20261014T135017132Z-r02v`). It saw only the source docs, the truth model, generator excerpts and the key code, with no mapper output and no scores. Its verdicts:
  - **One row per ingredient:** before not justified, after justified.
  - **HomeLog "taking" + "stop for now" → held:** before ambiguous, after justified.
  - **Riverside drug-caused diagnosis → allergy row:** after not justified by v1, because the substance and the existence of the row depended on another source's record.
- **v2 rules.** The Riverside rule now follows views v2 explicitly. The diagnosis label decides; the substance is the one drug of that class on the same document's list, otherwise the class as written.
- **Defects the judge found, all fixed:**
  - The one-per-ingredient collapse ran before publication scoping.
  - A drug-diagnosis row could duplicate an allergy-list row.
  - HomeLog recency used list position.
- **HomeLog at earlier dates.** Keys are now scoped by when each item was published. This fixes the HomeLog day-page bug at earlier as-of dates.
- **Freeze.** Keys and scorer were frozen at commit `a3df06b3`, hash `bb7c7cb090a2d081` (recorded in every compile record), before any round-2 compile.
- **Triage on train and dev only.** The hand-written reference mappers have 0 wrong and 0 extra rows on train and dev at all three dates. The test split is scored once per run.

### Views v2

Changes in `packages/views/views.d.ts`:

- **Sensitive entries** are reported and tagged with `sensitivity: Sensitivity[]`, never dropped. The categories are mental-health, substance-use, sexual-reproductive-health, hiv-sti and genetic.
- **Zone-less times** are read as America/Chicago local time.
- **Drug-caused diagnoses** yield both a problem row and an avoid-row, with the substance rule above.
- **On a patient's list, "taking" with a "stop for now" note is `held`.**
- **Tablet doses** are converted to mg when the strength is known; a range gives no dose.
- **The allergy view** is now a list of substances to avoid. It has `reaction_type` (hypersensitivity / side_effect / serious_adverse_event) and `mechanism` (immune / non_immune / unknown). ACE-inhibitor angioedema is hypersensitivity, non-immune.
- **US Core fixes.** In `uscore.d.ts`, `statusReason` is a single CodeableConcept, as FHIR R4 has it. `requester` is now included, which us-core-21 requires. The HL7 validator found both.

### Scoring

- **Per view, not pooled.** Each view is reported separately, with wrong-row rates next to precision and recall.
- **More fields scored:**
  - evidence citations
  - allergy onset, reaction, reaction type and mechanism
  - lab status
  - `otc`, `patient_reported` and `sensitivity`
- **Three as-of dates:** 2023-06-30, 2025-03-31 and 2026-10-13.
- **Traps:** reported per trap, with the number of distinct held-out patients, and with volume traps listed separately.
- **Stratified split.** The split is stratified by (source, trap). Every trap reaches 10 or more held-out patients except where the corpus has too few:
  - Lakeview T1: 13 patients in all
  - Lakeview T13: 2
  - Lakeview T19: 1
  - Riverside T19: 1
  - HomeLog T14: 18
  - HomeLog T19: 1
- **Training samples.** For each trap, the scorecard says whether the training samples show it.

### Other changes

- **Repeats.** There are three independent one-shot runs per cell for Opus, codex and Sonnet; conditions b and c run once each.
- **Ablation.** Opus, condition a, ran three times each on Northgate and Riverside with every schema comment removed.
- **FHIR validation.** I ran the official HL7 validator (US Core 8.0.1, terminology offline) over the hero plus 25 held-out patients per source.

## Headline: one-shot mappers by view

Wrong-row rate in percent: mean (min–max) over three runs, pooled over three dates. Held-out test split.

| Source | View | rows/run | Opus | codex | Sonnet |
|---|---|---|---|---|---|
| Northgate | meds / problems / allergies / labs / vitals | 2165 / 1753 / 66 / 23884 / 3228 | 0 in all views and runs | 0 | 0 |
| Lakeview | meds / problems / labs / vitals | 43 / 245 / 24045 / 617 | 0 | 0 | 0 |
| Riverside | medications | 284 | 0.0 | 0.0 | 12.4 (0.0–18.7) |
| Riverside | allergies | 33 | 0.0 | 0.0 | 17.2 (0.0–51.5) |
| Riverside | labs | 1817 | 0.0 | 0.0 | 0.9 (0.0–1.9) |
| Riverside | problems / vitals | 79 / 241 | 0 | 0 | 0 |
| HomeLog | medications | 371 | 0.7 (0.5–0.8) | 2.5 (0.3–3.8) | 1.6 (0.5–3.8) |
| HomeLog | vitals | 10462 | 0.0 | 0.0 | 0.0 |

All 36 one-shot runs type-check, run without exceptions on every patient and date, are deterministic, and have no
contract issues. US Core: every run has 0 wrong medication or lab rows, except HomeLog medications at 0.5%. The
HL7 validator reports 0 errors in 7 of 8 runs. The eighth, Riverside Opus, has 1 error: a duplicate resource id. Most
warnings are offline terminology and best-practice rules.

## What the remaining errors are

- **Riverside, Sonnet:**
  - "1 tab PO nightly" read as frequency `other` instead of QHS (53 rows per run in two runs).
  - Venous blood-gas pH and pCO2 left out (one or two runs).
  - SGLT2i-associated DKA typed `side_effect` instead of `serious_adverse_event` (one run, 16 rows).
- **HomeLog, all backends:**
  - "2 when my back hurts" (200 mg tablets) not converted to 400 mg, which is the v2 tablet rule.
  - A list naming Jardiance twice, one entry `taking` with no dates and one `stopped` 2024-09. The key prefers the current entry; the view does not settle this, and the judge flagged the same point.
  - One corpus quirk: the generator writes levothyroxine strength as "75 mg". Sonnet "corrected" it to mcg.
- **Volume traps.** No backend made a single error on T7, T9, T11 or T16 in any run.
- **Judgment traps.** T1, T3, T4, T5, T12, T17, T18 and T19 also had 0 errors, except Sonnet on Riverside T18 (17/198) and T15 (106/852).

## Documentation ablation (Opus, three runs)

| Source | full docs | types only |
|---|---|---|
| Northgate | 0 wrong rows in every view | 0 wrong rows in every view |
| Riverside | 0 | meds 12.8% (1.1–18.7), allergies 4.0% (0.0–6.1); other views 0 |

- **Northgate:** without docstrings, its field names, action codes and units are self-explanatory enough. The views v2 text and samples carry the rest.
- **Riverside:** without the docstrings, the "nightly" frequency, a levothyroxine dose unit and the DKA reaction type go wrong.
- **Caveat:** the views themselves are written with knowledge of each source's quirks (audit §5). This ablation removes the source docs only, so it understates how much documentation carries.

## Feedback and prose checking

- **Condition b.** Prose feedback changed nothing measurable. Sonnet Riverside medications stayed at 18.7%; labs went from 1.9 to 0.
- **Condition c.** Key counterexamples (calibration only) fixed Sonnet Riverside and most HomeLog dose cases.
- **Prose check on test items.** Every discrepancy it raised was a false alarm (9 Northgate, 14 Lakeview, 7 Riverside, 2 HomeLog), and it flagged none of the 33 Sonnet Riverside errors in its scope. With the round-2 views, the prose check added nothing.

## End to end

The generic merge was tuned in round 1 and is frozen now. Scored against the merged truth key restricted to what the records carry:

- The hand-written references reach 0.9% wrong medication rows plus 9 extra rows. These are record limits, e.g. "water pill" can't be linked to chlorthalidone. All other views are at 0.
- Opus matches the references in all three runs.
- Codex reaches 0.9–2.2% medication rows; Sonnet 0.9–2.8%.

## Spend and time

| | Cost | Runs or time |
|---|---|---|
| Opus | $33.93 | 27 runs, 126 agent-minutes |
| Sonnet | $5.52 | 18 runs |
| Codex | not reported | 21 runs, 261 agent-minutes |
| Prose extraction, key judge and probes | about $5 | |
| **Round 2 total** | **about $45** | budget $120 |

Wall time for the matrix was about 1.3 h.

## How to run

```
bun packages/compiler/src/cli/probe.ts claude|codex      # isolation probe
bun packages/compiler/src/cli/scan.ts                    # transcript scan
bun packages/compiler/src/cli/refcheck.ts dev            # reference mappers vs keys (train/dev only)
bun packages/compiler/src/cli/matrix.ts                  # round-2 matrix
bun run score [--reeval]                                 # SCORECARD.md, prose check, HL7 validation, cache
bun test packages/compiler/test
```

## Limits

- **The views know the sources.** The views were written by the corpus author, with knowledge of each source's traps. The keys are truth plus renderer knowledge from the same author. The reference-mapper check shows only that the keys and the author's reading agree.
- **Held-out is not unseen.** Held-out patients come from the same generator as the training patients. The samples show most traps: Northgate's samples show 11 of its 15 traps, including a pack-prefixed glargine line this round.
- **Small trap counts.** Some trap counts are small (see the split notes above). The one-shot cells where everything is 0 say only that no error occurred in 3 runs × the listed rows.
- **The merge was tuned on test.** The end-to-end merge rules were tuned in round 1 while looking at test-split results.
