# B — Northgate Family Medicine

Primary-care practice in the Springfield area (America/Chicago). Sees Linda Okafor longitudinally
2019–2026, sends her outpatient labs to Lakeview and files the results back into its own chart, and
refers her to Lakeview nephrology in 2026.

Issuer `did:web:northgate-fm.example` · patient id `NFM-00731552` · schema
[`schema/northgate-chart-v1.d.ts`](schema/northgate-chart-v1.d.ts), entry type `ChartEvent`.

## Modeling style: event log

- **One item per chart event.** One vital set, one medication change, one problem-list edit, one
  allergy-list edit, one signed visit note, one interfaced result report. Items from the same visit
  share a `visit_id` in the payload.
- **No current-state records.** The med, problem and allergy lists are replayed from events per line
  id (`med_id`, `problem_id`, `allergy_id`); the latest event for a line says where it stands.
- **Terse or absent prose.** Event comments are a line or two; visit notes are a few lines; interfaced
  results have no narrative at all.
- **Imported results are Northgate's own items.** Lakeview results are re-issued under Northgate ids,
  with Lakeview's accession and test code in `external_ref`, values as received (text), and one unit
  rewrite (platelets/WBC to `cells/uL`).
- **Errors are voided, not deleted.** A void is an item that `retracts` the bad item and records
  Northgate's reason code in a `chart_correction` entry. Voids are only for entries made in error; lab
  corrections arrive as superseding result items.

## Entry types

`visit` · `billing_dx` · `vital_set` · `med_event` · `problem_event` · `allergy_event` ·
`list_reviewed` · `imported_result` · `referral_event` · `referral_dx` · `chart_correction`

Diagnoses attached to a visit note or a referral are their own entries (`billing_dx`, `referral_dx`),
never a list inside the `visit` or `referral_event` entry, so each can be withheld on its own.

## Traps that live here

Most rows are shown in [the examples](#examples). Three are not, and describe records the Stage 1
generator produces: T5's `list_reviewed` events, T9's `">60"` eGFR import from 2021-01-14, and T19's
`restricted` lines.

| Trap | How it shows up in Northgate |
|---|---|
| T1 held vs discontinued | `med_event` actions `hold` (stays on the list, intent to resume) vs `stop` (final; restart is a new `med_id`). Empagliflozin goes `start` 2023-03-06 → `stop` 2024-11-12; Northgate never records the hospital hold. Finerenone is an `origin: "outside"` line that Northgate never updates when Lakeview holds it. |
| T3 corrected result | K 6.1 (hemolyzed, 2022-09-12) and its redraw K 4.6 are both filed; when Lakeview invalidates the 6.1, Northgate supersedes its 6.1 item with a corrected copy (`result_status` 'C', value "Result invalidated"). The 6.1 stays in the history view. |
| T4 entered in error | Atorvastatin 80 mg `start` on 2025-11-03, retracted the next day as `wrong_patient`. |
| T5 stale problem list | "Chronic kidney disease stage 3a" (`PL-11902`, 2022-02-07) is never updated. `list_reviewed` events (including at the 2026-05-04 referral visit) make it look freshly confirmed. |
| T7 platelets ×10³ | Imported platelet count 2025-08-18 filed as `"212000"` `cells/uL`, range `"150000-450000"` (Lakeview: 212 K/uL); WBC the same way. |
| T9 numbers as text | `imported_result.value` is text: `">60"` for 2021-01-14 eGFR. BP is `"152/94"` text in `vital_set.bp`. |
| T10 / T17 fuzzy onset | Problem and allergy onsets are full dates plus `precision`: HTN `2014-01-01`/`year`, T2DM `2016-01-01`/`year`. |
| T11 eGFR equation change | Until 2022-01-10 each creatinine comes with two eGFR entries (`EGFR-NAA`, `EGFR-AA`) carrying the MDRD LOINCs 48642-3 / 48643-1 that Lakeview sends, although the comment says CKD-EPI 2009; after, one race-free entry under a new code with no LOINC. |
| T12 negation | 2021-06-03: "No lip, tongue or throat swelling." next to the lisinopril cough. |
| T13 prose-only | "sick day rules reviewed" exists only in the 2024-11-12 visit note, as the narrative-only span `sick_day`. |
| T14 duplicates | Every Lakeview result appears here again under a Northgate item id; `external_ref.accession` matches Lakeview's. |
| T16 local codes | `imported_result.test.loinc` only when Lakeview sent one; outside finerenone has only `drug.outside_code` (`lakeview-drug`), no RxNorm. |
| T18 two shapes | Lisinopril = `intolerance`/`low`; empagliflozin = `adverse_reaction`/`high` (the hospital records the same DKA as a diagnosis). |
| T19 sensitive | Depression problem, sertraline line and any behavioral-health billing or referral diagnosis carry `restricted: "BH"`. |

## Examples

| File | Shows |
|---|---|
| [2019-03-18-problem-htn-added](examples/2019-03-18-problem-htn-added.folio.md) | year-precision onset (`2014-01-01`/`year`); no SNOMED on a pre-2020 line |
| [2021-06-03-lisinopril-intolerance](examples/2021-06-03-lisinopril-intolerance.folio.md) | allergy event, intolerance vs allergy, negation in prose, month-precision onset |
| [2021-09-20-lakeview-renal-panel](examples/2021-09-20-lakeview-renal-panel.folio.md) | imported result report, no narrative, two eGFR rows, `external_ref` |
| [2022-02-07-problem-ckd-3a-added](examples/2022-02-07-problem-ckd-3a-added.folio.md) | the problem line that goes stale |
| [2022-09-12-potassium-invalidated](examples/2022-09-12-potassium-invalidated.folio.md) | corrected copy that `supersedes` the imported K 6.1 (`result_status` 'C', "Result invalidated") |
| [2024-11-12-hospital-follow-up-note](examples/2024-11-12-hospital-follow-up-note.folio.md) | terse visit note; `billing_dx` entries ≠ problem list; narrative-only span |
| [2024-11-12-empagliflozin-adverse-reaction](examples/2024-11-12-empagliflozin-adverse-reaction.folio.md) | allergy-list `adverse_reaction`, `high` (the hospital has the same DKA as a diagnosis) |
| [2024-11-12-empagliflozin-stopped](examples/2024-11-12-empagliflozin-stopped.folio.md) | `stop` with `adverse_reaction` (contrast: hospital says `held`) |
| [2025-08-18-lakeview-a1c-cbc](examples/2025-08-18-lakeview-a1c-cbc.folio.md) | imported copy of Lakeview's accession LV25-230-00157; platelets and WBC rewritten to `cells/uL` |
| [2025-11-04-atorvastatin-80-voided](examples/2025-11-04-atorvastatin-80-voided.folio.md) | void via `retracts` + `chart_correction` |
| [2026-02-11-metformin-dose-reduced](examples/2026-02-11-metformin-dose-reduced.folio.md) | `change` event on an existing line (`ML-18806`): the latest event per `med_id` gives the current dose |
| [2026-07-20-finerenone-outside](examples/2026-07-20-finerenone-outside.folio.md) | `origin: "outside"` line with only a Lakeview drug id; never updated after Lakeview's hold |
