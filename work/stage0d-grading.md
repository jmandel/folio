# Stage 0d blind read: grading

Grades [stage0d-blind-answers.md](stage0d-blind-answers.md) against the truth as it stood when the
reader worked (Stage 0d `truth/`), evaluated at the reader's latest date, 2026-09-14. Where Stage 0e
changed the truth, the new key is given in the last column; those changes are not reader errors.

Cause codes for every error or miss:

- **(a)** a planted trap working as intended
- **(b)** a documentation or example gap on our side (fixed now, see the last section)
- **(c)** reader error

## Medications

| Drug | Reader | Truth at 2026-09-14 | Grade | Cause | Key after Stage 0e |
|---|---|---|---|---|---|
| Metformin | 1000 mg BID, active | 1000 mg BID, active | correct | | 500 mg BID since 2026-02-11 |
| Losartan | 50 mg daily, active | 50 mg, active | correct | | 100 mg since 2025-08-18 |
| Chlorthalidone | 12.5 mg (½ × 25 mg), active | 12.5 mg, active | correct (did not read the 25 mg tablet as the dose) | | same |
| Atorvastatin | 40 mg, active; 80 mg ignored as voided | 40 mg; 80 mg never existed (T4) | correct | | same |
| Sertraline | 100 mg, active, sensitive | 100 mg, active, sensitive | correct | | same |
| Insulin glargine | 10 u at bedtime, 12 if glucose > 200; "HomeLog only, no clinic prescriber, unverified" | 10 u nightly prescribed by B 2025-08-18; 12 u is P's `takenAs` | dose and self-adjustment correct; **source wrong** (prescribed, not patient-only) | (b): no clinic example mentions glargine | same |
| Ibuprofen (OTC) | 200–400 mg PRN about twice a week, P only | 400 mg about twice a week, P only | correct | | same |
| Finerenone | 10 mg, on hold since 2026-09-14; review date passed, still held | held, intent to resume | correct (joined `MED_STATUS_HIST` to `MED_ORDER` across items) | | same; HERO now says the 09-28 recheck was never drawn |
| Empagliflozin | stopped (A `held` read as "effectively stopped", B `stop`, P stopped) | stopped 2024-11-12 | correct | | same |
| Lisinopril | stopped 2021 (cough) | stopped 2021 | correct | | same |

Misses: none among active meds. The reader could not give Northgate's status for metformin or
chlorthalidone (no `med_event` example for them) and fell back on note prose. Cause (b).

## Allergies and intolerances

| Entry | Reader | Truth | Grade | Cause |
|---|---|---|---|---|
| Lisinopril | intolerance, low criticality, cough, no angioedema; one entry from three sources | same | correct (T12 negation and T18 shape both handled) | |
| Empagliflozin | adverse reaction, high criticality, euglycemic DKA | same | correct, but taken from the README because the `allergy_event` was not in any example | (b) |
| Riverside DKA as diagnosis, not allergy | noticed; "a reader building an allergy list from Riverside misses it" | intended (T18) | correct observation | (a) |

## Labs and units

| Item | Reader | Truth | Grade | Cause |
|---|---|---|---|---|
| Riverside BMP, VBG, BHB, troponin, CBC (2024-11-02) | all values as stored | same | correct | |
| Troponin `"<0.01"` | kept comparator | T9 | correct | |
| Platelets, Riverside `"268"` `10*3/uL` | 268 × 10³/µL | T7 | correct | |
| BHB 0.3, preliminary in consult vs final in discharge | one result, keep final | T14 within A | correct | |
| Lipase 28 (H&P, accession L24306-0415) | **missed**; thought "normal lipase" had no number | lipase 28 U/L | missed | (c): the H&P result was there; the reader skipped it |
| ED date in local time | 02:58Z on 11/02 = 21:58 on 11/01 | T10 | correct | |
| Venous pCO₂ | 24 | 24 | correct | Stage 0e changed it to 28 |
| Northgate 2021-09-20 eGFR pair 55 / 64 | "load NAA, or both flagged as variants"; race unknown | key: CKD-EPI 2021 recomputed (58), reported values kept | **partly wrong** (picked the non-AA row; no recompute) | (a): T11; race is in no source by design, so the only safe series is the recompute |
| Lakeview 2021-01-14 eGFR `">60"` / 9999999 | stored as `>60`, sentinel not loaded | T9 | correct | |
| Lakeview 2022-09-12 K 6.1 'C' | hidden; replacement 4.6 named from README only | 6.1 withdrawn, redraw 4.6 valid | correct, but 4.6 not verifiable | (b): redraw item missing from examples |
| Lakeview 2025-08-18 duplicate A1c (`ORDER_STATUS` 9, result 'F') | ignored | T4 | correct | |
| Lakeview platelets `"212"` `K/uL` | 212 × 10³/µL | T7 | correct | |
| Northgate platelet `"212000"` `cells/uL` | known only from README | T7 | correct by README | (b): no B example |
| Lakeview 2026-02-09 Cr 1.45, eGFR 41, Na 132, UACR 320, A1c 8.2 | all correct | same | correct | |
| K 2026-09-14 5.8 and 5.7 | both valid (CONF repeat), from note prose | T3 confirmation | correct | (b): no result rows in examples |
| K 2026-08-10 5.2 | not mentioned | in truth only | not graded: not in the example set | |
| Home glucose 7.8 mmol/L etc. | converted with 18.016; 140.5, 145.9 | T6, key 141, 146 | correct | |
| Home BP typo 184/88 | superseded by 148/88 | same | correct | |

Latest values (the reader gave tables, not a "latest" list; read off them): Cr 1.45 / eGFR 41
(2026-02-09), K 5.7 (2026-09-14), A1c 8.2, UACR 320, Na 132 match the Stage 0d key. Under the Stage 0e
truth the latest creatinine and eGFR are 1.52 / 39 (2026-09-14).

## Hidden or replaced items

| Item | Reader | Grade | Cause |
|---|---|---|---|
| Riverside med snapshots: discharge summary wins | yes | correct (T15) | |
| Riverside pancreatitis `ruled_out`, DKA `resolved` not active | yes | correct (T12) | |
| Northgate atorvastatin 80 mg retracted | yes | correct (T4) | |
| Northgate CKD 3a stale vs Lakeview G3b | flagged as likely stale, "format doesn't say which is current" | correct (T5); the uncertainty is the trap | (a) |
| Northgate `billing_dx` not problems | yes | correct | |
| Lakeview K 6.1 'C' while order is 4 | yes | correct (T2) | |
| Lakeview finerenone `MED_ORDER` 1 overridden by history row 3 | yes | correct (T1) | |
| Lakeview `LK-EGFR09A` rows "arguably hide" | partial | see T11 above | (a) |
| HomeLog superseded day page and med list | yes | correct | |
| Riverside empagliflozin `held` | read as effectively stopped, but flagged that `held` mixed "pause" and "recommend stop" | correct | (b): the schema admitted the overload |

## Summary

No wrong active medication, allergy or lab value. One reader miss (lipase, c). One trap fired as
intended (T11 race variant, a). Everything else that went wrong was ours (b): events that READMEs
described but no example showed, plus four small wording problems.

## Category (b) gaps and what was fixed

| Gap | Fix (Stage 0e) |
|---|---|
| README trap rows described records not in any example (B empagliflozin adverse reaction, B finerenone outside line, B platelets, B K correction, C K 4.6 redraw, C 2026-09-14 K rows, B HTN year onset) | Added the examples: Northgate `2019-03-18-problem-htn-added`, `2022-09-12-potassium-invalidated`, `2024-11-12-empagliflozin-adverse-reaction`, `2025-08-18-lakeview-a1c-cbc`, `2026-07-20-finerenone-outside`; Lakeview `2022-09-12-potassium-redraw`, `2026-09-14-potassium-high`, `2026-09-14-potassium-repeat`. Northgate README now names the three rows that remain Stage 1 only. |
| No example showed a second event on a Northgate med line (the replay) | `2026-02-11-metformin-dose-reduced` (`change` on `ML-18806`). |
| Glargine looked patient-only | Lakeview 2026-07-13 note now states metformin 500 BID and glargine 10 u. |
| Riverside `held` covered both "pause" and "I recommend not restarting" | New `HomeMed.restart_advice` (`resume_when_able` / `prescriber_decides` / `advise_against`), documented per value; examples set it. |
| Riverside: entry keys "not stable" vs keys that visibly repeat | Docstring now says keys often repeat but are not guaranteed; match by ingredient and dose. |
| Riverside: unit of `ref_range` unstated | Docstring: same unit as `value`. |
| HomeLog README called metformin 2 × 500 mg a disagreement (it was the same dose) | Sentence removed; the list now shows the 2026-02 reduction (1 × 500 mg twice a day). |
| `schema.sha256: "TODO"` everywhere | Real hashes; `work/schema-hashes.ts` rewrites them; `check-examples.ts` fails on a stale one. |
| Spec did not say how a reader learns that an item it holds was replaced | `spec/record-item.md` corrections section: items never point forward; replacement is known only from the replacing item, and payload pointers may name rows the reader lacks. |

Not changed: the reader's wish for a "current state" view in Lakeview and Northgate. Replaying status
rows and events is the point of those two styles (T1), and both schemas say how to compute the current
state.
