# Stage 3 scorecard (round 3)

## How these numbers were made

- **History.** Round 1 scored mappers against keys that were changed while looking at test-split errors. Round 2 froze the keys first, but its views (v2) had been revised after round-1 test errors, using strings from the corpus generator, and were scored on test patients that mostly overlapped round 1. Round 3 replaces both: views v3 were written blind (a fresh sandboxed agent given only output semantics; `work/views-v3/README.md`), and all headline numbers come from a fresh held-out cohort generated after the key and scorer code were frozen. Round 1 and 2 results are kept in `results/stage3/round1/` and `round2/` and are not used here.
- **Key and scorer code** frozen at hash `26ee28163e5c6e69` (work/decisions.md, round 3); every round-3 compile record carries the hash it was compiled under.
- **Fresh cohort.** 180 patients (seed `folio-stage3-fresh-final`, trap-targeted quotas in packages/truth/src/cohort.ts), corpus-fresh/, notes from the Stage 1 note pipeline. No record, key row or mapper output from it was looked at before scoring.
- **Mappers.** Compiled from the main corpus: the source schema, the views and about eight items from training patients. They were scored in the compile loop on the main corpus's dev split only (the cache gate).
- **Scoring.** Each mapper runs on every fresh patient at three as-of dates. Each fact is counted once per date: the tables use 2026-10-13 (end of the corpus) unless they say otherwise. A row is wrong if it is missing, duplicated, or any scored field is wrong ([Fields](#fields) lists them); extra rows are mapper rows with no expected counterpart. Equivalents the views accept (a "nightly" once-daily direction as QHS or QD) are accepted; rows the views leave open (a patient list naming one drug twice with different statuses) are not scored.

## One-shot mappers with views v3

Condition a: schema, views v3, training samples; no feedback. Three independent runs per backend. Wrong-row rate in percent at 2026-10-13, mean (min–max) over the runs; then `+n` extra rows in the worst run. `rows`: expected rows per run.

| Source | View | rows | opus | codex | sonnet |
|---|---|---|---|---|---|
| northgate | medications | 1015 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | problems | 724 | 0.0 (0.0–0.0) | 3.0 (0.0–4.6), +33 | 0.0 (0.0–0.0) |
| northgate | allergies | 87 | 13.0 (0.0–19.5) | 19.5 (19.5–19.5) | 19.5 (19.5–19.5) |
| northgate | labs | 13126 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | vitals | 1664 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | medications | 31 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | problems | 181 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0), +1 | 0.0 (0.0–0.0) |
| lakeview | labs | 13411 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | vitals | 500 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | medications | 549 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | problems | 119 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 4.8 (0.0–14.3) |
| riverside | allergies | 77 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0), +15 | 4.8 (0.0–14.3) |
| riverside | labs | 3736 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.9 (0.0–2.6) |
| riverside | vitals | 487 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| homelog | medications | 463 | 1.2 (0.0–3.0) | 8.1 (6.0–9.1) | 3.9 (2.8–6.0) |
| homelog | vitals | 10663 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |

Northgate allergies: the wrong rows are the `mechanism` field (see [Fields](#fields)). Every backend reports `immune` for entries Northgate types `allergy`; Northgate's schema defines that type as immune-mediated and views v3 say to report `immune` when the source says so, while the frozen key accepts only `non_immune` or `unknown` (the truth has no immune-mediated reaction). This is a conflict between the key and the source's documentation, found on the main corpus's dev split; the key was not changed after the fresh cohort was scored.

Runs:

- northgate, opus: `20261014T153538312Z-nujp`, `20261014T153538677Z-z4fp`, `20261014T153539049Z-zvsb`
- northgate, codex: `20261014T154116264Z-od40`, `20261014T154154989Z-3fxa`, `20261014T154342973Z-q65f`
- northgate, sonnet: `20261014T155821473Z-92mb`, `20261014T160020324Z-gnw6`, `20261014T160132343Z-cv4r`
- lakeview, opus: `20261014T153539262Z-il83`, `20261014T153539401Z-l8h6`, `20261014T153539543Z-cshd`
- lakeview, codex: `20261014T154355543Z-9scr`, `20261014T154533938Z-me8g`, `20261014T154607812Z-vee9`
- lakeview, sonnet: `20261014T160244423Z-7hq5`, `20261014T160307288Z-bgo0`, `20261014T160421055Z-xfjj`
- riverside, opus: `20261014T153539589Z-ml0t`, `20261014T153539627Z-7ft6`, `20261014T153957266Z-w38r`
- riverside, codex: `20261014T154731596Z-b6sz`, `20261014T154745387Z-rrw1`, `20261014T155403852Z-gi6n`
- riverside, sonnet: `20261014T160429071Z-lyhz`, `20261014T160511610Z-ft6r`, `20261014T160613430Z-hx2n`
- homelog, opus: `20261014T154010398Z-due5`, `20261014T154025060Z-lt22`, `20261014T154034951Z-vrxs`
- homelog, codex: `20261014T155645977Z-tsqc`, `20261014T155711358Z-zdkg`, `20261014T155801994Z-cbqt`
- homelog, sonnet: `20261014T160723195Z-jdnf`, `20261014T160729761Z-8upl`, `20261014T160738707Z-dujv`

### Earlier as-of dates

Same runs, mean wrong-row rate over the three runs, at the two earlier dates (each a separate count of the facts true then).

| Source | View | 2023-06-30 opus | 2023-06-30 codex | 2023-06-30 sonnet | 2025-03-31 opus | 2025-03-31 codex | 2025-03-31 sonnet |
|---|---|---|---|---|---|---|---|
| northgate | medications | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| northgate | problems | 0.0 | 1.2 +23 | 0.0 | 0.0 | 1.7 +20 | 0.0 |
| northgate | allergies | 22.2 | 33.3 | 33.3 | 15.6 | 23.4 | 23.4 |
| northgate | labs | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| northgate | vitals | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| lakeview | medications | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| lakeview | problems | 0.0 | 0.0 +1 | 0.0 | 0.0 | 0.0 +1 | 0.0 |
| lakeview | labs | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| lakeview | vitals | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| riverside | medications | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| riverside | problems | 0.0 | 0.0 | 15.8 | 0.0 | 0.0 | 6.8 |
| riverside | allergies | 0.0 | 0.0 +1 | 14.6 | 0.0 | 0.0 +7 | 6.3 |
| riverside | labs | 0.0 | 0.0 | 0.6 | 0.0 | 0.0 | 1.0 |
| riverside | vitals | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| homelog | medications | – | – | – | 0.8 | 6.5 | 2.2 |
| homelog | vitals | – | – | – | 0.0 | 0.0 | 0.0 |

### Compile and run

- opus: 12 runs; 12 produced a mapper; 12 type-check; 12 ran on every fresh patient and date without throwing; 12 deterministic; contract issues in 0.
- codex: 12 runs; 12 produced a mapper; 12 type-check; 12 ran on every fresh patient and date without throwing; 12 deterministic; contract issues in 0.
- sonnet: 12 runs; 12 produced a mapper; 12 type-check; 12 ran on every fresh patient and date without throwing; 12 deterministic; contract issues in 0.

## Traps

Fresh cohort, all three as-of dates. Per backend: errors / trap-bearing facts summed over the three runs (a fact is an expected row or a fact that must not appear); in brackets, the most patients with an error in one run. `Patients`: distinct fresh patients carrying the trap in that source. `In samples`: the trap appears in that source's training samples. Volume traps (carried by nearly every lab or reading) come last in each source.

| Source | Trap | Patients | In samples | opus | codex | sonnet |
|---|---|---|---|---|---|---|
| northgate | T1 held vs discontinued | 98 | no | 0/903 | 0/903 | 0/903 |
| northgate | T2 status on two axes | 23 | yes | 0/159 | 0/159 | 0/159 |
| northgate | T3 superseded/corrected vs confirmed result | 47 | yes | 0/633 | 0/633 | 0/633 |
| northgate | T4 entered in error | 22 | yes | 0/129 | 0/129 | 0/129 |
| northgate | T5 stale problem list | 27 | yes | 0/189 | 0/189 | 0/189 |
| northgate | T12 negation and rule-outs | 22 | yes | 0/162 | 0/162 | 0/162 |
| northgate | T17 fuzzy onset | 165 | yes | 0/2295 | 102/2295 (29) | 0/2295 |
| northgate | T18 same reaction, two shapes | 63 | yes | 0/411 | 0/411 | 0/411 |
| northgate | T19 redaction hides a relevant med | 60 | no | 0/519 | 0/519 | 0/519 |
| northgate | T7 platelets x10^3 (volume) | 145 | no | 0/5490 | 0/5490 | 0/5490 |
| northgate | T9 numbers as text / sentinel (volume) | 63 | yes | 0/1638 | 0/1638 | 0/1638 |
| northgate | T10 date-only and time-zone shifts (volume) | 165 | yes | 0/2295 | 102/2295 (29) | 0/2295 |
| northgate | T11 eGFR equation change (volume) | 90 | yes | 0/22563 | 0/22563 | 0/22563 |
| northgate | T14 duplicates across sources (volume) | 163 | yes | 0/84429 | 0/84429 | 0/84429 |
| northgate | T16 local codes without standard codes (volume) | 163 | yes | 0/23418 | 0/23418 | 0/23418 |
| lakeview | T1 held vs discontinued | 18 | yes | 0/87 | 0/87 | 0/87 |
| lakeview | T2 status on two axes | 23 | yes | 0/159 | 0/159 | 0/159 |
| lakeview | T3 superseded/corrected vs confirmed result | 47 | yes | 0/633 | 0/633 | 0/633 |
| lakeview | T4 entered in error | 21 | no | 0/138 | 0/138 | 0/138 |
| lakeview | T5 stale problem list | 59 | yes | 0/390 | 0/390 | 0/390 |
| lakeview | T7 platelets x10^3 (volume) | 145 | no | 0/5490 | 0/5490 | 0/5490 |
| lakeview | T9 numbers as text / sentinel (volume) | 64 | no | 0/1647 | 0/1647 | 0/1647 |
| lakeview | T11 eGFR equation change (volume) | 92 | yes | 0/22716 | 0/22716 | 0/22716 |
| lakeview | T14 duplicates across sources (volume) | 163 | yes | 0/84429 | 0/84429 | 0/84429 |
| lakeview | T16 local codes without standard codes (volume) | 167 | yes | 0/23829 | 0/23829 | 0/23829 |
| riverside | T1 held vs discontinued | 57 | no | 0/297 | 0/297 | 0/297 |
| riverside | T12 negation and rule-outs | 44 | yes | 0/264 | 0/264 | 0/264 |
| riverside | T15 per-document med re-snapshot | 106 | no | 0/2835 | 0/2835 | 0/2835 |
| riverside | T18 same reaction, two shapes | 67 | yes | 0/915 | 0/915 | 28/915 (15) |
| riverside | T10 date-only and time-zone shifts (volume) | 107 | no | 0/21363 | 0/21363 | 166/21363 (48) |
| riverside | T14 duplicates across sources (volume) | 97 | no | 0/18870 | 0/18870 | 166/18870 (48) |
| homelog | T1 held vs discontinued | 12 | no | 19/51 (12) | 34/51 (12) | 0/51 |
| homelog | T6 glucose unit shift | 24 | no | 0/6366 | 0/6366 | 0/6366 |
| homelog | T13 prose-only facts | 24 | yes | 0/84 | 42/84 (13) | 42/84 (13) |
| homelog | T14 duplicates across sources (volume) | 26 | no | 0/786 | 0/786 | 0/786 |

Every judgment trap has at least 10 fresh patients in each source where it occurs.

No view row in the fresh cohort carries A:T19, C:T19, C:T13, P:T19 (source:trap). Riverside, Lakeview and HomeLog T19 (a behavioral-health fact in that source) do not occur in the fresh cohort: the generator places them only on the hero. Lakeview T13 occurs (8 fresh patients) but is a prose-only fact (a decision written only in a note), which no view row represents.

## Views v2 (source hints) and v3 (blind)

Opus, condition a, three runs each, fresh cohort, wrong-row rate at the latest date. v2 was written by the corpus author with knowledge of each source's quirks; v3 was written blind. Same types, schemas and samples.

| Source | View | rows | v3 | v2 |
|---|---|---|---|---|
| northgate | medications | 1015 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | problems | 724 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | allergies | 87 | 13.0 (0.0–19.5) | 0.0 (0.0–0.0) |
| northgate | labs | 13126 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | vitals | 1664 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | medications | 31 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | problems | 181 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | labs | 13411 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | vitals | 500 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | medications | 549 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | problems | 119 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | allergies | 77 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | labs | 3736 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | vitals | 487 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| homelog | medications | 463 | 1.2 (0.0–3.0) | 0.0 (0.0–0.0) |
| homelog | vitals | 10663 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |

- northgate v2 runs: `20261014T135845477Z-2w5l`, `20261014T135845899Z-rczc`, `20261014T135846342Z-l939`
- lakeview v2 runs: `20261014T135846512Z-t45v`, `20261014T135846686Z-moot`, `20261014T135846855Z-h6aj`
- riverside v2 runs: `20261014T135846919Z-s27j`, `20261014T135846981Z-3dxu`, `20261014T135847018Z-9l9w`
- homelog v2 runs: `20261014T140224958Z-eu4v`, `20261014T140306045Z-1sjr`, `20261014T140344791Z-mykn`

## Documentation ablation (views v3)

Opus, condition a, three runs each, fresh cohort: the full source schema versus the same schema with every comment removed (types, field names and enum values only). Views v3 and samples unchanged. Wrong-row rate at the latest date.

| Source | View | rows | full schema | types only |
|---|---|---|---|---|
| northgate | medications | 1015 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | problems | 724 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | allergies | 87 | 13.0 (0.0–19.5) | 18.4 (0.0–55.2) |
| northgate | labs | 13126 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| northgate | vitals | 1664 | 0.0 (0.0–0.0) | 0.1 (0.1–0.1), +2 |
| lakeview | medications | 31 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | problems | 181 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| lakeview | labs | 13411 | 0.0 (0.0–0.0) | 1.9 (1.9–1.9) |
| lakeview | vitals | 500 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | medications | 549 | 0.0 (0.0–0.0) | 0.7 (0.0–1.1) |
| riverside | problems | 119 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | allergies | 77 | 0.0 (0.0–0.0) | 7.4 (0.0–22.1) |
| riverside | labs | 3736 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| riverside | vitals | 487 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |
| homelog | medications | 463 | 1.2 (0.0–3.0) | 1.0 (0.0–3.0) |
| homelog | vitals | 10663 | 0.0 (0.0–0.0) | 0.0 (0.0–0.0) |

- northgate types-only runs: `20261014T160826208Z-8m4f`, `20261014T160838304Z-n2xt`, `20261014T160852937Z-zsfv`
- lakeview types-only runs: `20261014T160901436Z-lyhs`, `20261014T160914718Z-y985`, `20261014T160959227Z-04ob`
- riverside types-only runs: `20261014T161203476Z-1nhm`, `20261014T161226997Z-8b6y`, `20261014T161309081Z-afv8`
- homelog types-only runs: `20261014T161510726Z-2j37`, `20261014T161541498Z-sppj`, `20261014T161558496Z-ljwb`

## Secondary: main corpus, old test split

The same round-3 v3 mappers on the main corpus's test split (patients that earlier rounds were scored and triaged on), at 2026-10-13. Mean wrong-row rate over the three runs. Shown for comparison only.

| Source | View | opus | codex | sonnet |
|---|---|---|---|---|
| northgate | medications | 0.0 | 0.0 | 0.0 |
| northgate | problems | 0.0 | 2.5 +24 | 0.0 |
| northgate | allergies | 8.3 | 12.5 | 12.5 |
| northgate | labs | 0.0 | 0.0 | 0.0 |
| northgate | vitals | 0.0 | 0.0 | 0.0 |
| lakeview | medications | 0.0 | 0.0 | 0.0 |
| lakeview | problems | 0.0 | 0.0 | 0.0 |
| lakeview | labs | 0.0 | 0.0 | 0.0 |
| lakeview | vitals | 0.0 | 0.0 | 0.0 |
| riverside | medications | 0.0 | 0.0 | 0.0 |
| riverside | problems | 0.0 | 0.0 | 3.2 +1 |
| riverside | allergies | 0.0 | 0.0 +6 | 8.3 |
| riverside | labs | 0.0 | 0.0 | 0.6 |
| riverside | vitals | 0.0 | 0.0 | 0.0 |
| homelog | medications | 0.8 | 7.2 | 4.5 |
| homelog | vitals | 0.0 | 0.0 | 0.0 |

## US Core output and the HL7 validator

The round-2 US Core mappers (written against views v2 and the round-2 `uscore.d.ts`, which already had the `statusReason` and `requester` fixes; not recompiled in round 3), run on 25 fresh patients per source at 2026-10-13. Structure and US Core profile conformance: the official HL7 FHIR validator (R4, US Core 8.0.1, each resource declaring its US Core profile) over every resource, terminology offline. Terminology: every distinct coding and UCUM unit checked with tx.fhir.org `CodeSystem/$validate-code` (code exists; display matches). Value-set binding checks against tx.fhir.org were not completed: run through the validator they took over 15 minutes per 40 resources. Validator engine exceptions (its own calls to tx.fhir.org timing out or failing, although run with offline terminology) are counted apart; they are not findings about the resources. Both invalid codes in the Riverside output come from `uscore.d.ts` itself, which tells the mapper to use LOINC 53060-9 for beta-hydroxybutyrate (tx.fhir.org: unknown code) and the analyte unit "mmHg" as the UCUM code (UCUM is `mm[Hg]`); the display mismatches are short display names where LOINC and RxNorm expect their own. Every issue is in `results/stage3/fhir/fresh-<runId>.json`.

| Source | Backend | Run | Resources | Structural errors | Validator terminology errors | Distinct codes | Invalid codes (tx.fhir.org) | Display mismatches | Validator engine exceptions | Most common error |
|---|---|---|---|---|---|---|---|---|---|---|
| northgate | opus | `20261014T143022875Z-l512` | 1888 | 1 | 0 | 49 | 0 | 0 | 35 | Constraint failed: bdl-7: 'FullUrl must be unique in a bundle, or else entries with the same fullUrl (1) |
| northgate | codex | `20261014T143236688Z-rb1c` | 1888 | 0 | 0 | 49 | 0 | 0 | 35 | – |
| lakeview | opus | `20261014T143039261Z-a0zl` | 2201 | 0 | 0 | 26 | 0 | 2 | 0 | – |
| lakeview | codex | `20261014T143327087Z-69l0` | 2201 | 0 | 0 | 26 | 0 | 0 | 0 | – |
| riverside | opus | `20261014T143102452Z-s6h8` | 999 | 1 | 0 | 50 | 2 | 13 | 0 | Constraint failed: bdl-7: 'FullUrl must be unique in a bundle, or else entries with the same fullUrl (1) |
| riverside | codex | `20261014T143346140Z-rnob` | 999 | 0 | 0 | 50 | 2 | 13 | 0 | – |
| homelog | opus | `20261014T143130921Z-c36o` | 131 | 0 | 0 | 31 | 0 | 0 | 0 | – |
| homelog | codex | `20261014T143451369Z-c7j9` | 131 | 0 | 0 | 31 | 0 | 0 | 0 | – |

## Merged chart (end to end)

Each source's v3 one-shot mapper runs on its own items for every fresh patient; the generic merge (`packages/compiler/src/merge.ts`, tuned in round 1, unchanged since) combines them; the result is scored at 2026-10-13 against the merged truth key, restricted to facts and fields some source records. A medication whose current status no structured record carries (it is only in a note) is counted under prose-only, not as a wrong row. Wrong-row rate per view, `+n` extra rows; prose-only rows: wrong/total.

| Mappers | medications | problems | allergies | labs | vitals | prose-only medication rows |
|---|---|---|---|---|---|---|
| reference (hand-written) | 1.2 +12 | 0.0 +8 | 0.0 | 0.0 | 0.0 | 1/1 |
| opus run 1 | 2.9 +29 | 0.0 +8 | 0.0 | 0.0 | 0.0 | 1/1 |
| opus run 2 | 1.4 +14 | 0.0 +8 | 12.6 | 0.0 | 0.0 | 1/1 |
| opus run 3 | 1.4 +14 | 0.0 +8 | 12.6 | 0.0 | 0.0 | 1/1 |
| codex run 1 | 4.3 +29 | 0.0 +8 | 12.6 +15 | 0.0 | 0.0 | 1/1 |
| codex run 2 | 7.6 +61 | 0.0 +9 | 12.6 | 0.0 | 0.0 | 1/1 |
| codex run 3 | 5.6 +41 | 0.0 +9 | 12.6 +10 | 0.0 | 0.0 | 1/1 |
| sonnet run 1 | 5.6 +41 | 0.0 +8 | 12.6 | 0.0 | 0.0 | 1/1 |
| sonnet run 2 | 5.0 +36 | 2.0 +8 | 12.6 | 0.6 | 0.0 | 1/1 |
| sonnet run 3 | 2.5 +12 | 0.0 +8 | 12.6 | 0.0 | 0.0 | 1/1 |

## Fields

Field results over all v3 one-shot runs of each backend (all sources and dates): correct / scored. Only fields with an error are listed.

| Field | opus | codex | sonnet |
|---|---|---|---|
| allergies.mechanism | 890/972 | 849/972 | 849/972 |
| allergies.reaction_type | 972/972 | 972/972 | 944/972 |
| labs.evidence | 186432/186432 | 186432/186432 | 186266/186432 |
| labs.status | 186432/186432 | 186432/186432 | 186266/186432 |
| labs.unit | 186432/186432 | 186432/186432 | 186266/186432 |
| labs.value | 186432/186432 | 186432/186432 | 186266/186432 |
| medications.dose | 12657/12657 | 12615/12657 | 12615/12657 |
| medications.ingredient | 12703/12705 | 12645/12705 | 12685/12705 |
| medications.status | 12733/12750 | 12716/12750 | 12750/12750 |
| problems.evidence | 7866/7866 | 7866/7866 | 7825/7866 |
| problems.onset | 6012/6012 | 5890/6012 | 6012/6012 |
| problems.status | 7866/7866 | 7866/7866 | 7825/7866 |

All scored fields: allergies.criticality, allergies.evidence, allergies.mechanism, allergies.onset, allergies.reaction, allergies.reaction_type, labs.egfr_equation, labs.evidence, labs.status, labs.unit, labs.value, medications.dose, medications.evidence, medications.frequency, medications.ingredient, medications.otc, medications.patient_reported, medications.sensitivity, medications.status, medications.status_since, medications.stop_reason, problems.ckd_stage, problems.evidence, problems.onset, problems.sensitivity, problems.status, vitals.diastolic_mmhg, vitals.evidence, vitals.glucose_mg_dl, vitals.pulse_bpm, vitals.repeat_diastolic_mmhg, vitals.repeat_systolic_mmhg, vitals.systolic_mmhg, vitals.weight_kg.

## Cost and time (round-3 compiles)

New round-3 compile runs only (the reused round-2 v2 runs are not counted). Notes for the fresh cohort and the regenerated main-corpus notes cost about $32 (sonnet, `runs/prose/`); the blind views writer about $0.9.

| Backend | Runs | Cost (USD, as the CLI reports it) | Agent minutes |
|---|---|---|---|
| opus | 24 | 36.35 | 149 |
| codex | 12 | not reported | 177 |
| sonnet | 12 | 4.49 | 23 |

## Isolation

Agents run under bubblewrap with no network of their own (`--unshare-net`); the only route out is a per-run CONNECT proxy that allows the model API hosts and logs every connection to `<run>/network.log`. $HOME, /tmp and /run/user are empty mounts; the environment is cleared; IPC, PID and UTS namespaces are private; claude's web tools are disallowed. Probe runs in `runs/compiler/isolation-probe-v2/`: claude, and codex with its own command sandbox turned off inside bwrap (`codex-nosandbox/`), each get 403 from the proxy for github.com and raw.githubusercontent.com, cannot resolve any host directly, reach the model API host only through the proxy, and see no repo files, agent histories or D-Bus session.
The transcript scan (`bun packages/compiler/src/cli/scan.ts`) over 187 recorded runs found 1 agent tool calls using network tools, 0 using IPC and 0 web-tool calls outside the probes; 654 connections were denied. All but 2 were the codex CLI's own connections (ab.chatgpt.com, oaiusercontent.com image hosts). The others: registry.npmjs.org:443 (views-v3/20261014T151559955Z-roja): the blind views writer ran `npx -y tsc` to type-check its file, and the proxy refused the package download.

## Cached mappers

A mapper is cached when it type-checks, runs without errors, is deterministic, has no contract issues, passed the isolation scan, and had (wrong + extra rows) / rows below 1% in every view on the main corpus's dev split (set before any held-out run). Condition c and the ablation are never cached; round 3 has only condition a.

- `mappers/3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-opus/transform.ts` (run `20261014T153539589Z-ml0t`)
- `mappers/3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-sonnet/transform.ts` (run `20261014T160429071Z-lyhz`)
- `mappers/3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/codex-gpt-6-astra/transform.ts` (run `20261014T154731596Z-b6sz`)
- `mappers/6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-opus/transform.ts` (run `20261014T153538312Z-nujp`)
- `mappers/e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-opus/transform.ts` (run `20261014T153539262Z-il83`)
- `mappers/e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-sonnet/transform.ts` (run `20261014T160244423Z-7hq5`)
- `mappers/e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/codex-gpt-6-astra/transform.ts` (run `20261014T154355543Z-9scr`)
- `mappers/481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-opus/transform.ts` (run `20261014T154025060Z-lt22`)
- `mappers/481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34/d3f0920ebb40e2f60db193bd7e8b7bdffbb80be5d248114b816cf98859892f0b/claude-sonnet/transform.ts` (run `20261014T160723195Z-jdnf`)
