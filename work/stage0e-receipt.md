# Stage 0e receipt

Applies [stage0d-review.md](stage0d-review.md) (all high and medium findings, most low ones) and grades
the blind read ([stage0d-grading.md](stage0d-grading.md)). Not committed. Decisions are logged in
[decisions.md](decisions.md#stage-0e-2026-10-13-review-fixes).

Checks: `bun work/check-examples.ts` → 31 payloads, 0 problems (now also verifies `schema.sha256`);
`bun work/schema-hashes.ts --check` → all current.

## Clinical fixes (truth and sources kept in step)

| Change | Where |
|---|---|
| K 4.6 added to the 2026-02-09 requisition | Lakeview example; HERO; 07-13 note cites it |
| 4-week follow-up: 2026-08-10 Cr 1.50 / eGFR 40 with K 5.2; 2026-09-14 Cr 1.52 / eGFR 39 with K 5.8, repeat 5.7; 09-28 recheck never drawn | HERO timeline and "Latest labs"; new Lakeview examples |
| Losartan 50 → 100 mg on 2025-08-18; finerenone added on maximal ARB, reason stated | HERO; Lakeview 07-13 note; HomeLog list |
| Metformin 1000 → 500 mg BID on 2026-02-11 (eGFR 41) by Northgate | new Northgate example; HERO; HomeLog list (agrees); Lakeview note; MODEL history entries can now carry a dose change |
| DKA: glargine 2 h before the drip stops, after the closed-gap BMP; glargine stopped at discharge | Riverside consult and discharge summary; HERO |
| Venous pCO₂ 24 → 28 (Winter's formula; H–H gives pH 7.22) | Riverside ED note; HERO |
| Losartan held during the DKA stay, resumed at discharge | Riverside H&P, consult, discharge; HERO |
| 2021-01-14 computed eGFR 76 → 75 | HERO; Lakeview NOTES |
| Smaller: Advil `started: "2025"`; finerenone `START_DATE` 07-14 named in HERO; "midday yesterday" for BHB 2.1 | HomeLog, HERO, Riverside |

## Spec breaches fixed

- Lakeview 2026-07-13: sertraline is inside its own narrative-only span `na_sertraline` (README and
  checker list it).
- Northgate: `visit.billing_dx` and `referral_event.dx` lists replaced by top-level `billing_dx` and
  `referral_dx` entries (with `restricted`); the follow-up note example is flattened.
- Every example carries the real SHA-256 of its schema (`work/schema-hashes.ts`, rerunnable).

## Riverside `held`

`held` now means only "paused; someone decides later". New `HomeMed.restart_advice`:
`resume_when_able`, `prescriber_decides`, `advise_against`, documented per value. Discharge
empagliflozin is `held` + `advise_against`. T1 still bites: held is not stopped, and Northgate stops it.

## Trap coverage (new examples)

| Trap | Example |
|---|---|
| T3 | Lakeview `2022-09-12-potassium-redraw` ('HEM'), `2026-09-14-potassium-high` + `-repeat` ('CONF'); Northgate `2022-09-12-potassium-invalidated` (supersedes its 6.1 copy) |
| T7, T14 | Northgate `2025-08-18-lakeview-a1c-cbc` (`212000` `cells/uL`, range rewritten), the pair of Lakeview's item with the same accession |
| T10/T17 | Northgate `2019-03-18-problem-htn-added` (`2014-01-01`/`year`) |
| T18 | Northgate `2024-11-12-empagliflozin-adverse-reaction` (`adverse_reaction`/`high`) |
| T1/T16 | Northgate `2026-07-20-finerenone-outside` |

TRAPS.md: T1 wording, T3 'CONF', T7 range rewrite, T11 CKD 3a wrinkle, T14 within-A status drift and
example pair.

## Blind-read grading

No wrong active med, allergy or lab value. One reader miss (lipase 28, c); one trap fired as intended
(T11 race variant, a); the rest were our gaps (b): README-only events, the `held` overload, two
Riverside docstrings, HomeLog's metformin sentence, TODO hashes, and no spec sentence on forward
pointers. All fixed; see the grading file.

## Open

- NPIs fail Luhn on purpose (logged in decisions.md).
- Low item 15's "no GLP-1 RA considered" is left as realistic inertia.
