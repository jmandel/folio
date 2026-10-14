# Hero patient: Linda Okafor

Synthetic. Any resemblance to a real person is accidental.

| | |
|---|---|
| Born | 1965-08-22 (age 61 at 2026-10-13) |
| Sex | Female |
| Race / ethnicity | Black or African American (matters for the eGFR trap, see [TRAPS.md](TRAPS.md#t11-egfr-equation-change)) |
| Home | Springfield area, time zone America/Chicago |
| Language | English |
| Occupation | School administrator |

## Sources

| Key | Name | Kind | Modeling style | What it sees |
|---|---|---|---|---|
| A | **Riverside Regional Hospital** | Hospital: ED, inpatient, hospitalist, endocrine consult | Signed documents: one item per signed document (ED note, H&P, progress note, consult, discharge summary) sharing an encounter id; rich prose; flat payload with only lab panels nested; each document re-lists the home meds; payload times in UTC | ED visit and admission for euglycemic DKA, 2024 |
| B | **Northgate Family Medicine** | Primary care | Event log: many small items (one per vital, med change, problem change, imported result), terse prose | Longitudinal primary care 2021–2026; imports outside lab results; referral out |
| C | **Lakeview Labs & Kidney Care** | Outreach reference lab + nephrology clinic on one system | Coded tables: lookup codes, integer statuses, units in separate fields, values stored as text; little prose | All outpatient labs since 2021 (Northgate sends them here); nephrology care from 2026-06 |
| P | **HomeLog** (patient's app) | Patient-generated | Patient's own schema; one day page per day; local wall-clock times without offsets | Home BP 2023–, glucose meter readings, insulin dose log, symptom notes, her own medicine list (including OTC drugs no clinic knows about) |

## Story in one paragraph

Linda has had hypertension since about 2014 and type 2 diabetes since 2016 (onset year only). In 2021
lisinopril gives her a cough and Northgate switches her to losartan. CKD stage 3a is diagnosed in early
2022. In 2023 Northgate adds empagliflozin for kidney and diabetes benefit. In November 2024, after three
days of gastroenteritis with little eating, she is admitted to Riverside with **euglycemic DKA** (glucose
only 182 mg/dL); empagliflozin is held in hospital and Northgate stops it for good at follow-up,
recording it as an adverse reaction. Her kidney function keeps falling (eGFR 54 → 41, albuminuria rising),
so in 2026 Northgate refers her to Lakeview nephrology. The question for the referral: **should an
SGLT2 inhibitor be re-tried for kidney protection, given the DKA?** Lakeview's intake agent asks
clarifying questions the record doesn't clearly answer. Separately, Linda has depression treated with
sertraline, which she would rather not share with the kidney clinic — but sertraline is a plausible cause
of the low sodium the nephrologist is also asked about. Two things only her own app knows: she takes
over-the-counter ibuprofen for her knee, and she adjusts her insulin dose herself.

## Timeline

Times are local (America/Chicago) unless noted. "Src" lists where the event is recorded; **bold** is the
originating system.

| Date | Event | Src | Recorded how |
|---|---|---|---|
| ~2014 | HTN onset | **B** | Problem list, onset "2014" (year precision) |
| ~2016 | T2DM onset | **B** | Problem list, onset "2016" (year precision) |
| 2019-03-18 | Northgate adds HTN to its problem list with onset 2014 (year precision) | **B** | Problem event, `2014-01-01`/`year`, no SNOMED (line predates 2020) |
| 2019 | Depression (MDD, recurrent, mild) dx; sertraline 100 mg daily | **B** | Problem + med, flagged sensitive (behavioral health) |
| 2021-01-14 | Baseline labs: Cr 0.98 mg/dL, eGFR reported ">60" (both CKD-EPI 2009 rows; computed 65 / 75), A1c 7.4% | **C**, B (imported) | C stores eGFR as text ">60" with numeric sentinel; B imports copy |
| 2021-01-14 | Meds at baseline: metformin 1000 mg BID, lisinopril 20 mg, atorvastatin 40 mg, sertraline 100 mg | **B** | Med events |
| 2021-06-03 | Dry cough 2 months → lisinopril stopped, losartan 50 mg started | **B** | Med events + intolerance entry "lisinopril: cough". Prose: "No lip, tongue or throat swelling." |
| 2021-07-01 | Lakeview reporting rule changes: eGFR ≥ 60 was printed ">60"; from now numeric up to 90, ">90" above | **C** | Documented in C's schema only |
| 2021-09-20 | Cr 1.12, eGFR 55 (non-AA) / 64 (AA) | **C**, B | Two eGFR result rows (CKD-EPI 2009 with race coefficient), coded with the MDRD LOINCs 48642-3 / 48643-1 |
| 2022-01-10 | Lakeview switches to race-free CKD-EPI 2021 | **C** | New result code for eGFR; old code retired |
| 2022-02-07 | Cr 1.18, eGFR 54, UACR 85 mg/g → **CKD stage 3a** added | **C**, **B** | B problem event; C results |
| 2022-05-16 | BP above goal → chlorthalidone 12.5 mg added | **B** | Med event |
| 2022-09-12 | K 6.1 (hemolyzed) → recollected same day K 4.6 | **C**, B | C: supersedes its first requisition item, restating the 6.1 row as withdrawn (`RESULT_STATUS` 'C') with a pointer to the redraw; the redraw is its own requisition (`REPEAT_REASON` 'HEM'). B imported both, then supersedes its 6.1 copy with a corrected copy ("Result invalidated") |
| 2023-03-06 | eGFR 49, A1c 7.9 → empagliflozin 10 mg started; metformin unchanged | **B**, C | Med event; prose gives reason "CKD + DM, cardiorenal benefit" |
| 2023-04 → | Home BP readings ~2×/week; home glucose meter (set to mmol/L until 2024-02) | **P** | App readings, local time without offset |
| 2024-02-10 | Meter switched to mg/dL | **P** | Unit field changes mid-series |
| 2024-10-29 → 11-01 | Gastroenteritis, poor intake; keeps taking empagliflozin | **P** | Symptom notes (prose only): "can't keep food down, still taking my pills" |
| 2024-11-01 21:40 CDT (= 11-02 02:40Z) | ED: nausea, vomiting, Kussmaul breathing; glucose 182 mg/dL, venous pH 7.21, pCO₂ 28 mmHg, HCO₃ 11, anion gap 24, β-hydroxybutyrate 6.2 mmol/L, Na 129, K 5.0, Cr 1.41, eGFR 43, platelets 268, lipase 28 (resulted after the ED note), troponin <0.01 | **A** | ED note: "R/O pancreatitis" (working), "No evidence of ACS". H&P: "Pancreatitis ruled out: lipase 28" |
| 2024-11-02 01:30 → 11-05 11:30 | Admitted: **euglycemic DKA, SGLT2i-associated**, precipitant gastroenteritis + reduced intake; insulin infusion with dextrose; anion gap closed on the 11-03 06:10 BMP, glargine 14 u given 07:00, infusion stopped 09:00 (2 h overlap); glargine + correction lispro until discharge. Empagliflozin and metformin **held**; chlorthalidone and losartan held for volume depletion (K 5.0, Cr 1.41); atorvastatin and sertraline continued. Daylight time ends 11-03 02:00 (UTC−5 → UTC−6) | **A** | Admission H&P, progress notes, endocrinology consult, discharge summary (each re-lists meds) |
| 2024-11-05 | Discharge: metformin, chlorthalidone and losartan resumed; glargine stopped (no insulin at discharge); empagliflozin "held — do not resume until PCP review"; Na 133 at discharge | **A** | Discharge summary: status `held` with `restart_advice: "advise_against"`; prose "I would not restart it" |
| 2024-11-12 | PCP follow-up: empagliflozin **discontinued**; adverse reaction entry "empagliflozin: euglycemic DKA"; sick-day rules taught | **B** | Med event, allergy/intolerance event, terse note |
| 2025-02-17 | Lipid panel on atorvastatin 40 mg: total cholesterol 168, TG 140, HDL 48, LDL 92 (calculated) | **C**, B | Lakeview `LK-LIPID` requisition; B imports the four rows |
| 2025-08-18 | A1c 8.6 → insulin glargine 10 units nightly started; BP above goal with albuminuria → losartan 50 → 100 mg (maximum dose) | **B**, C | Med events |
| 2025-08-18 | Platelets 212 | **C**, B | C: "212" unit code K/uL; B import: 212000 "cells/uL" |
| 2025-10 → | Self-adjusts glargine: 10 units, 12 if that day's glucose was over 200 mg/dL (earlier dose logs show 10) | **P** | My Medicines list "how I take it" (patient's words); dose logs. No clinic knows |
| 2025-11-03 | Atorvastatin 80 mg entered on Linda's chart in error (meant for another patient), voided next day | **B** | Med event, then retraction event |
| 2026-02-09 | Cr 1.45, eGFR 41, K 4.6, UACR 320 mg/g, Na 132, A1c 8.2 | **C**, B | CKD now stage 3b by labs; B problem list still says "CKD stage 3a" |
| 2026-02-11 | eGFR < 45 → metformin reduced 1000 → 500 mg BID (max 1000 mg/day at eGFR 30–44) | **B**, P | B `med_event` `change` (phone); P's list (2026-05-02) shows 500 mg, 1 tablet twice a day |
| 2026-03-28 | OTC ibuprofen (Advil 200 mg, 2 tablets about twice a week for knee pain, taking since about 2025) appears on her own medicine list | **P** | My Medicines list, `over_the_counter`. No clinic knows |
| 2026-05-04 | Referral to Lakeview nephrology: "eGFR decline, albuminuria, prior SGLT2i euDKA — re-challenge?" | **B** | Referral event + short letter; later steps: scheduled 2026-06-02, closed 2026-07-20 |
| 2026-06 | Lakeview intake (agent-to-agent): clarifying questions — see below | **C** ↔ B, P | Exchange stage |
| 2026-07-13 | Nephrology visit: CKD 3b A3 confirmed; albuminuria persists on maximum losartan, K 4.6 (Feb) → finerenone 10 mg prescribed (`START_DATE` 07-14); K and creatinine in 4 weeks; SGLT2i **not** re-tried for now ("revisit after sick-day plan proven"); problem list updated | **C** | Coded visit rows + short note |
| 2026-07-20 | Northgate phone reconciliation adds finerenone from Lakeview's visit summary | B | Outside med line, Lakeview drug id only (no RxNorm); never updated afterwards |
| 2026-08-10 | 4-week check: K 5.2, Cr 1.50, eGFR 40 → finerenone continued, recheck in 5 weeks | **C**, B | Results; Lakeview phone contact with a short note |
| 2026-09-14 | Morning K 5.8 (not hemolyzed; Cr 1.52, eGFR 39), confirmed on same-day redraw 5.7 (`REPEAT_REASON` 'CONF') → finerenone **held**, recheck K in 2 weeks | **C**, B | C: two requisition items and a phone contact with a status-history row 1 → 3 (the original order row still says 1). B imports the results; its outside finerenone line still shows active |
| 2026-09-28 | Planned K recheck not drawn (she has not gone to the lab) | | Nothing recorded anywhere; finerenone stays held |
| 2026-10-13 | Now | | |

### Current truth (2026-10-13)

- **Active meds:** metformin 500 mg BID (since 2026-02-11), losartan 100 mg, chlorthalidone 12.5 mg, atorvastatin 40 mg,
  sertraline 100 mg, insulin glargine 10 u nightly as prescribed (she takes 12 u on days her glucose was
  over 200; known only to P), ibuprofen 400 mg OTC about twice a week (known only to P).
- **Held:** finerenone 10 mg (since 2026-09-14, intent to resume).
- **Stopped:** lisinopril (cough, 2021), empagliflozin (euDKA, 2024). Atorvastatin 80 mg never existed (voided).
- **Problems:** HTN, T2DM, CKD stage 3b with severe albuminuria (A3), hyperlipidemia, MDD recurrent mild
  (sensitive), hyponatremia (mild and persistent: Na 129 in 2024, 132 in 2026; Lakeview records E87.1
  as active on 2026-07-13), history of euglycemic DKA 2024 (resolved).
- **Allergies / intolerances:** lisinopril — cough (intolerance, not allergy; no angioedema);
  empagliflozin — euglycemic DKA (adverse reaction, high severity).
- **Latest labs:** Cr 1.52 mg/dL, eGFR 39 (2026-09-14); K 5.7 (2026-09-14 redraw, confirming 5.8 the
  same morning; both valid); Na 132, A1c 8.2, UACR 320 mg/g (2026-02-09); LDL 92 mg/dL (2025-02-17). The 2-week K recheck due
  2026-09-28 has not been drawn, so there is no newer K and finerenone stays held.

## Where facts live (modality matrix)

| Fact | Prose only | Structured only | Both | Duplicated across sources |
|---|---|---|---|---|
| Lisinopril stopped for cough | | | B (note + intolerance) | |
| "No angioedema" (negation) | B | | | |
| DKA precipitant (gastroenteritis, poor intake) | A (H&P), P (symptom notes) | | | |
| Patient kept taking empagliflozin while sick | **P only** | | | |
| Pancreatitis / ACS ruled out | A | | lipase/troponin values structured in A | |
| Empagliflozin held vs discontinued | | | A `held` + `restart_advice: "advise_against"` ("would not restart"); B `discontinued` | A and B disagree by design |
| Euglycemic DKA as adverse reaction | | | B | A has it as a diagnosis, B as a reaction |
| β-hydroxybutyrate, pH, anion gap | | A | | |
| Outpatient labs | | C | | C → B import (same accession) |
| Home BP / glucose | | P | | |
| CKD stage | B problem (stale 3a) | C results imply 3b | C visit (3b, 2026-07) | B vs C disagree until 2026-07 |
| Depression, sertraline | | | B | Sertraline re-listed in every A document; P lists sertraline (no depression); C's 2026-07-13 note names sertraline in its own span (after Q3 below) |
| OTC ibuprofen use | | P (self-reported list) | | Unknown to A, B, C |
| Glargine self-adjusted dose | P ("12 if my sugar was over 200") | P dose logs | | B says 10 u nightly |
| Metformin dose reduction (2026-02) | | | B med event (+ note) | P list agrees (500 mg, 1 twice a day); A's 2024 documents show the old 1000 mg BID |
| Finerenone held | | C status-history row | C note | B outside line still active (never reconciled) |
| Re-challenge decision | C note | | | |

## The referral exchange (drives the agent-to-agent stage)

Northgate's agent submits Lakeview's published intake contract with selective disclosures. Lakeview's
agent asks:

1. **What precipitated the DKA?** Answer lives in A's H&P prose and P's symptom notes, not in any
   structured field.
2. **Was she on insulin at the time? Any ketone values?** A structured (no insulin before admission;
   BHB 6.2).
3. **Hyponatremia (Na 129 → 133 → 132): any medications that could contribute?** Chlorthalidone is
   disclosed. **Sertraline is withheld** under Linda's "hide mental health" preference. The presentation
   shows that items were withheld (not what they were), and the agent asks whether any withheld
   medication is relevant to sodium. Linda (via HomeLog) chooses to disclose sertraline alone, without
   the depression problem or notes.
4. **Has she been taught sick-day rules?** B note, terse: "sick day rules reviewed".
5. **Any NSAIDs or other over-the-counter medicines?** Only P knows: ibuprofen about twice a week. Linda
   discloses that one `my_med` entry. (NSAIDs matter for both her kidney function and her potassium.)
