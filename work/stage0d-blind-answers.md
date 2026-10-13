# Stage 0d blind read: answers

Read only: spec/record-item.md, spec/schema-conventions.md, and each source's README, schema and examples.
Patient appears to be one woman (Linda Okafor, ~59-60 y, T2DM, HTN, CKD) known under four local ids.
"Latest date anywhere" = 2026-09-14 (Lakeview phone contact). Today per environment is 2026-10-13.

Note: the three READMEs for Riverside, Northgate and Lakeview contain "Traps" tables that describe events
not present in the examples (e.g. Northgate's empagliflozin allergy event, finerenone outside line, K 4.6
redraw, imported platelet 212000). I used those README statements where flagged "(README only)"; they are not
verifiable from the examples.

---------------------------------------------------------------------------------------------------

## A. Riverside Regional Hospital (4 documents, 2024-11-01 to 2024-11-05)

### 1. What it is
A community hospital publishing one signed clinical document per item (ED note, H&P, consult, discharge
summary; a progress note type also exists). The narrative is the signed note; the payload holds typed
structured entries (encounter, diagnosis, history, allergy, home_med, inpatient_med, vitals, result, panel,
follow_up) that are snapshots as of signing. Every document re-lists all home meds, allergies and diagnoses
with that document's status, and lab results are copies repeated in whichever note reviewed them. Payload
times are UTC, prose times are local (Chicago). Documents of one stay share `encounter_id`
RRH-ENC-6620417.

### 2. Medications (status as of the latest item, the 2024-11-05 discharge summary)
Method: schema says only the latest discharge summary's `home_med.status` is the post-discharge instruction;
earlier docs' statuses are during-stay plans. Matched lines across docs by `rxnorm_ingredient` + `dose_text`.

| Drug | Status at discharge | Evidence / earlier statuses |
|---|---|---|
| metformin 1000 mg, 1 tab BID with meals | continue | ED not_reconciled, H&P held, consult held ("may resume"), discharge continue |
| empagliflozin 10 mg daily | held (instruction "Do not resume until reviewed by PCP") | prose in discharge: "I would not restart it"; consult: "do not restart ... any SGLT2 inhibitor". The structured status is `held`, but intent is effectively stopped. Treat as not taking. |
| losartan 50 mg daily | continue | |
| chlorthalidone 12.5 mg (1/2 of 25 mg tab) daily | continue | held during stay, resumed at discharge |
| atorvastatin 40 mg nightly | continue | |
| sertraline 100 mg daily | continue | |
Inpatient-only (not home meds, ended): lactated Ringer's, regular insulin IV infusion (stopped 2024-11-03 10:30Z),
D5LR (H&P, only seen as a ref id), insulin lispro correction scale (started 2024-11-03, "No insulin at
discharge"). H&P: I only read its med statuses/ids; it shows held/held/continue/held/continue/continue-ish
(I did not read every line).

### 3. Labs (normalized; all values stored as text in source; times are UTC, convert to local for date)
| Collected (UTC) | Test | Value | Unit as normalized | Source notes |
|---|---|---|---|---|
| 2024-11-02T02:58Z | Sodium | 129 | mmol/L | |
| | Potassium | 5.0 | mmol/L | |
| | Chloride | 94 | mmol/L | |
| | Bicarbonate | 11 | mmol/L | flag LL |
| | Anion gap | 24 | mmol/L | |
| | BUN | 31 | mg/dL | |
| | Creatinine | 1.41 | mg/dL | |
| | eGFR (CKD-EPI 2021) | 43 | mL/min/1.73m2 | |
| | Glucose | 182 | mg/dL | |
| | Venous pH | 7.21 | (unitless) | |
| | pCO2 venous | 24 | mmHg | |
| | Beta-hydroxybutyrate | 6.2 | mmol/L | no LOINC |
| | Troponin I | `<0.01` | ng/mL | comparator: store as "<" + 0.01, not 0.01 |
| | WBC | 14.2 | 10^3/uL | |
| | Hemoglobin | 14.1 | g/dL | |
| | Platelets | 268 | x10^3/uL | already thousands, unit `10*3/uL` |
| 2024-11-02T17:05Z | BHB | 2.1 | mmol/L | (only as consult entry; no accession date issue) |
| 2024-11-03T12:10Z | BMP: Na 131, K 4.2, Cl 99, CO2 21, AGap 11, BUN 19, Creat 1.36, eGFR 45, Glucose 148 | | | |
| 2024-11-03T12:10Z | BHB | 0.3 | mmol/L | duplicate: consult says preliminary, discharge says final (same accession L24308-0098). Keep final. |
| 2024-11-05T12:00Z | BMP: Na 133, K 4.3, Cl 101, CO2 23, AGap 9, BUN 14, Creat 1.33, eGFR 46, Glucose 136 | | | |
Unsure: (a) a second troponin/lipase is mentioned in prose ("normal lipase") with no numeric result anywhere.
(b) The H&P has a second result (accession L24306-0415, probably lipase) I did not inspect, and a copy of
the 0412 BMP. (c) Local-date conversion: 02:58Z on 11/02 is 21:58 on 11/01 local.

### 4. Hide / treat as replaced
No `supersedes`/`retracts` in these four items. But as a reader: (i) collapse duplicate result copies
(same accession + test code) and keep the most advanced status (final over preliminary); (ii) for meds, ignore
the ED/H&P/consult list snapshots in favour of the discharge summary; (iii) diagnosis `ruled_out`
(pancreatitis K85.90) and `resolved` (DKA, adverse effect) must not appear as active problems even though the
codes are present; "R/O pancreatitis" `working` in the ED note is superseded in meaning by the discharge
`ruled_out`.

### 5. Confusing / under-documented
- All four items have `schema.sha256: "TODO"` (validation impossible).
- The `held` status conflates "pause" with "I recommend permanent stop" (schema admits this); only the prose
  tells you. A structured-only consumer will show empagliflozin as paused.
- `HomeMed` docstring says to match lines across docs by `rxnorm_ingredient` + `dose_text`, but the entry keys
  (`med_empa`) happen to be stable in all examples. Which is it?
- `effective` rules: README says ED note effective = arrival; discharge `effective` = admission time with
  `effective_end`; but discharge summary prose says "Admitted 11/02/2024 01:30" local while `admitted`
  payload is 06:30Z. Consistent (CDT) but easy to get wrong.
- `diagnosis.status = "resolved"` for "adverse effect of empagliflozin": the underlying drug intolerance is
  not resolved; there's no allergy entry for empagliflozin at all, so a reader building an allergy list from
  Riverside misses it (README says deliberately).
- Mixed RxNorm levels: ingredient CUI here (1545653) vs SCD CUI 1545658 in Northgate/HomeLog for the same drug.
- `Result.value` is text and `unit` absent for pH; no field says which unit the "ref_range" is in.
- The H&P is long; prose section "Allergies" is a ref to an entry that lists only lisinopril.

---------------------------------------------------------------------------------------------------

## B. Northgate Family Medicine (6 items, 2021-06-03 to 2025-11-04)

### 1. What it is
A primary-care practice that publishes its EHR chart as an append-only event log, one FOLIO item per event
(allergy-list edit, problem-list edit, med-list change, vital set, signed visit note, interfaced lab report,
referral step, void). There is no current-state record: lists are rebuilt by replaying events per line id
(`med_id`, `problem_id`, `allergy_id`) in `effective` order. Narrative is terse or absent; imported Lakeview
results are re-issued under Northgate ids with Lakeview accession in `external_ref`. Errors are voided via
`retracts` plus a `chart_correction` entry.

### 2. Medications
Only one medication line is visible in the examples:
- ML-30577 empagliflozin 10 mg QD: `stop` 2024-11-12, `stop_reason` adverse_reaction ("euglycemic DKA"). Final
  (restart needs new med_id). Status: stopped.
Determined by: latest (only) event for that med_id, `action: stop`.
The 2024-11-12 visit note says in prose "Metformin and chlorthalidone continue per discharge", but there are no
`med_event` items for them in examples, so I cannot give their Northgate status/dose beyond prose.
Atorvastatin 80 mg `start` (2025-11-03) was voided (wrong_patient), so it is NOT a medication of this patient;
the retraction narrative says "Atorvastatin 40 mg unchanged". README only: finerenone `origin: outside` line
never updated by Northgate.

### 3. Labs (imported from Lakeview, 2021-09-20, accession LV21-263-00417)
| Test | Value | Unit | Notes |
|---|---|---|---|
| Creatinine | 1.12 | mg/dL | flag H |
| eGFR non-African-American (EGFR-NAA) | 55 | mL/min/1.73m2 | comment says CKD-EPI 2009, LOINC is MDRD one (48642-3) |
| eGFR African-American (EGFR-AA) | 64 | mL/min/1.73m2 | same calc with race coefficient, not a second measurement |
Unsure: which eGFR applies to this patient (race not given) - ambiguity left to the reader; I would load NAA
as the eGFR series or both flagged "calc variant". Also the prose in the CKD problem item gives "eGFR 54, UACR 85"
(2022-02-07) with no structured result; UACR 85 mg/g exists only in prose. README only: platelets filed as
"212000" cells/uL -> 212 x10^3/uL; eGFR ">60" 2021-01-14.

### 4. Hide / treat as replaced
- `2025-11-04-atorvastatin-80-voided` retracts item 01K95NT4FGX9G8FGVSQE8Z5379: hide that atorvastatin 80 mg
  start (and the void item itself describes no clinical event). The retracted item is not in the example set,
  so I cannot see it; I'd hide it by id.
- Problem PL-11902 "CKD stage 3a" (2022-02-07) is likely stale: Lakeview records G3b/A3 on 2026-07-13. Not
  hidden by the format; the reader has to reason (README warns this).
- `list_reviewed` events (not in examples) do not confirm lines.
- Imported eGFR-AA row: alternative calc, hide or keep as secondary.
- README only: K 6.1 (hemolyzed) item superseded by "Result invalidated" item.
- The `visit` item's `billing_dx` (Z09, E11.22, N18.31) are billing codes, not problems.

### 5. Confusing / under-documented
- The retracted item id is unavailable in examples, so I couldn't verify the void works; also no
  `med_event` for metformin/chlorthalidone to show the replay in practice (a replay example with 2+ events on
  one line is missing).
- Allergy `severity` is actually criticality (documented, good) but `AllergyEvent` examples only show 'low'.
- `ImportedResult.unit` platelet rewrite to cells/uL is documented only in schema prose; there is no example
  platelet row. A newcomer must remember to divide by 1000.
- `bp` is text "152/94" (documented) but no example vital_set item to confirm.
- `effective` on 2022-02-07 problem item is date-only while `recorded` has -06:00; `onset.precision` day.
  Not confusing, but problem `onset` is FuzzyDate whereas envelope uses partial dates: two date conventions.
- `ImportedResult.comment` says CKD-EPI 2009 but LOINC says MDRD (documented in README/schema; surprising).
- Visit note `effective` (09:30) is before the stop (09:52); visit_id link is the only grouping.
- `author.id` uses `urn:northgate-fm.example:staff:treyes` - fine, unlike Riverside format; no consistency.
- `sha256` is presumably also TODO (I filtered the line out of my view; not checked).

---------------------------------------------------------------------------------------------------

## C. Lakeview Labs & Kidney Care (6 items, 2021-01-14 to 2026-09-14)

### 1. What it is
A reference lab plus a nephrology clinic on one database. Each payload entry is a table row (type = table
name, UPPER_SNAKE columns, integer/letter status codes, code tables as enums). Lab items = one per
requisition (LAB_REQ, LAB_ORDER, LAB_RESULT rows); clinic items = one per contact (CLINIC_VISIT, VISIT_DX, VITAL,
MED_ORDER, MED_STATUS_HIST rows) with a short signed nephrologist note. Corrections re-publish the whole
requisition/contact via `supersedes`; medication status changes are history rows in later contacts.

### 2. Medications
Method: MED_STATUS on the MED_ORDER, overridden by NEW_STATUS of the latest MED_STATUS_HIST for the RX_ID.
- RX-30418 finerenone 10 mg PO QD (started 2026-07-14): MED_ORDER status 1 (active) in 2026-07-13 item;
  2026-09-14 MED_STATUS_HIST 1 -> 3 (on hold, reason LAB, review 2026-09-28, K 5.8/5.7). Current: **on hold**.
Prose-only: continues losartan 50 and chlorthalidone 12.5 (clinic "does not keep a full home med list", so no
MED_ORDER rows). "Not re-trying an SGLT2i".

### 3. Labs
| Collected | Test | Value | Normalized unit | Notes |
|---|---|---|---|---|
| 2021-01-14 | Creatinine | 0.98 | mg/dL | |
| 2021-01-14 | eGFR 2009 NAA / AA | `>60` / `>60` | mL/min/1.73m2 | comparator; VALUE_NUM is sentinel 9999999, do NOT load; store as >60 (lower bound) |
| 2021-01-14 | A1c | 7.4 | % | |
| 2022-09-12 | Potassium | 6.1 | mmol/L | RESULT_STATUS C: invalid (hemolyzed). Do not load as a valid value; replacement RS-71230566 (K 4.6 per Northgate README) lives in an item not provided |
| 2025-08-18 | A1c | 8.6 | % | duplicate order OR-8813052 (status 9) with result row also F; ignore it |
| 2025-08-18 | WBC | 6.8 | x10^3/uL | |
| 2025-08-18 | Hemoglobin | 12.1 | g/dL | |
| 2025-08-18 | Platelets | 212 | x10^3/uL | unit K/uL = thousands/uL; no conversion needed |
| 2026-02-09 | Creatinine | 1.45 | mg/dL | |
| 2026-02-09 | eGFR CKD-EPI 2021 | 41 | mL/min/1.73m2 | no LOINC |
| 2026-02-09 | Sodium | 132 | mmol/L | |
| 2026-02-09 | UACR | 320 | mg/g | |
| 2026-02-09 | A1c | 8.2 | % | |
| prose 2026-09-14 | K 5.8 and 5.7 | | mmol/L | only in clinic note; no lab item given; both valid (CONF repeat) |
Unsure: (a) the glucose conversion: no glucose rows here. (b) For 2021-01-14, whether the two eGFR rows
(NAA/AA) are two values or one measurement; schema says calculation variants (at most one applies). (c) the
2022-09-12 item is the *superseding* item, and it holds the C-status row; the original (K 6.1 final) is in an
unseen item.

### 4. Hide / treat as replaced
- 2022-09-12 K 6.1: RESULT_STATUS C, withdrawn. Hide the value (it is also in the superseded item
  01GCS992FRPWC6MKC8C79DYZY4 which the supersedes field hides).
- 2025-08-18 duplicate A1c order OR-8813052 (ORDER_STATUS 9) and its result row RS-93307712, even though the row
  says F. Same value 8.6 as the real one, so the double must not be counted twice.
- LK-EGFR09A rows (alt calc, race variant) arguably hide.
- Finerenone's MED_ORDER row still says status 1; the later hist row overrides it.
- The supersedes id in the 2022 item.

### 5. Confusing / under-documented
- 2022-09-12 file: ORDER_STATUS 4 ("resulted") together with RESULT_STATUS C. Documented but easy to trip on.
- `REPLACED_BY_RESULT_ID` points to an item/row not in examples; can't follow it.
- MED_STATUS_HIST row appears with no MED_ORDER row in the same item (documented).
- Finerenone status requires cross-item join (RX_ID), not obvious from a single item; no "current state" view.
- 2026-09-14 K 5.8/5.7 appear only in prose (the lab items for them are missing from examples).
- VALUE_NUM 9999999 sentinel (documented, but nasty). `UNIT_CODE` "K/uL" is non-UCUM.
- `LK-EGFR21` has no LOINC so the eGFR series needs code joining across 3 codes + Northgate codes.
- `CKD_G` 'G3b' conflicts with Northgate problem list 3a: nothing in the format says which is current.
- `LAB_REQ` row lacks `type` on some of my greps? No: it has it; but payload keys "req" vs type naming
  (`req`, `ord_*`, `res_*`) are arbitrary, not by table; harmless.
- Hidden second weight/height unit: Lakeview weight in kg; no BP position.

---------------------------------------------------------------------------------------------------

## D. HomeLog (patient diary app, 6 items, 2023-04-11 to 2026-05-02)

### 1. What it is
A patient-run diary on her phone. Two item types: a day page (BP/glucose readings, dose logs, diary notes) and
a My Medicines list (one `my_med` per medicine, whole list restated on each save). All patient-generated, none
clinician-reviewed. Patient's words live in narrative `<ref>` spans; payload holds only symptom tags and
readings. Times are local wall-clock with no offset; glucose unit is whatever the meter displayed, per reading.

### 2. Medications (as of 2026-05-02 list)
Status method: `my_med.status` ('taking'/'stopped') on the latest list item (it supersedes an earlier list).
| Medicine | Status | Details |
|---|---|---|
| Metformin 500 mg | taking | "2 pills morning, 2 at supper" = 1000 mg BID; matches hospital |
| Losartan 50 mg | taking | 1 in the morning; replaced lisinopril |
| "water pill" 12.5 | taking | patient note "chlorthalidone I think" - unconfirmed identity |
| Atorvastatin 40 mg | taking | bedtime |
| Sertraline 100 mg | taking | 1 in the morning |
| Lantus (insulin glargine) 100 u/mL | taking | 10 units at bedtime, 12 if sugar > 200; started 2025-08-18 |
| Advil 200 mg (OTC) | taking | 2 tabs for knee, ~2x/week |
| Jardiance (empagliflozin) 10 mg | stopped | 2023-03 to 2024-11; "doctor said never take again" |
| Lisinopril | stopped | 2021, made me cough |
Also dose_log entries: Lantus 10 units taken 2025-08-19 21:45.

### 3. Labs
HomeLog has no lab results. Self-measured glucose, to mg/dL:
| Measured (local, no tz) | Value as stored | mg/dL |
|---|---|---|
| 2023-04-11 06:48 | 7.8 mmol/L | 140.5 (x18.016) |
| 2024-02-10 07:51 | 8.1 mmol/L | 145.9 |
| 2024-02-10 19:42 | 162 mg/dL | 162 |
| 2024-10-31 08:22 | 171 mg/dL | 171 |
| 2025-08-19 07:06 | 212 mg/dL | 212 |
(BP readings: 142/86, 138/84 (2023-04-11), 136/82 (2024-02-10), 148/88 typed 2025-08-19 after correcting 184/88.)
Unsure: how many digits to keep after conversion; whether a self-reported fingerstick belongs in a lab table
at all.

### 4. Hide / treat as replaced
- 01K32Y3SP83XC8N4W8T61981JQ (2025-08-19 day page, BP 184/88 typo) is superseded by 01K354MY... (BP 148/88);
  show only the latter. Counting entries across both double-counts glucose, insulin and the note.
- The prior My Medicines list (01KMTFFYM012DNBYBDSS7S2EVN, not in examples) is superseded by 2026-05-02's.

### 5. Confusing / under-documented
- README says the list "disagrees" with clinics on metformin as 2 x 500 mg; by my arithmetic that equals 1000 mg
  BID, so it agrees in dose (different tablet strength). The disagreement is cosmetic.
- `losartan` `picked_from_search.rxnorm 52175` is an ingredient code displayed as "losartan" with strength "50 mg"
  typed separately, vs. metformin picks a specific SCD: mixed granularity (documented).
- The "water pill" has no code; mapping it to chlorthalidone is a guess.
- 2024-02-10 diary note mentions the meter change but the schema does not tell you what time the switch
  occurred (only per-reading unit); fine because unit is per reading.
- Day-page `effective` is a bare date while payload times lack offset; "recorded" in UTC means 2024-10-31 local
  evening readings are published as UTC the next day; fine.
- `my_med.started: "2016"` partial dates fine per spec. `stopped` absent on lisinopril? present ("2021").
- Day-page narrative bold time label is outside the span (documented). Sentence "still taking my pills" is
  clinically important (SGLT2i while vomiting) but there is no way to know which pills.
- HomeLog `diary_note.severity` and tags: tags like 'short_of_breath' not mapped.
- `author` role "Patient": schema says nothing about the legal/consent status of patient-generated content.

---------------------------------------------------------------------------------------------------

## 6. Merged current picture (as of 2026-09-14, latest item; today is 2026-10-13)

### Active medications
| Medication | Evidence | Notes / conflicts |
|---|---|---|
| Metformin 1000 mg BID with meals | Riverside discharge 2024-11-05 continue; Northgate visit prose (continue); HomeLog 2 x 500 BID (2026-05-02) | Dose agrees. Northgate med_event not provided. |
| Losartan 50 mg daily | Riverside, HomeLog 2026-05, Lakeview 2026-07-13 prose | |
| Chlorthalidone 12.5 mg daily (1/2 x 25 mg) | Riverside, Northgate prose, Lakeview prose, HomeLog "water pill 12.5" | Lakeview says it likely contributes to hyponatremia; no change made. |
| Atorvastatin 40 mg nightly | Riverside, HomeLog; Northgate void note confirms 40 mg | 80 mg start was entered on another patient's chart: ignore. |
| Sertraline 100 mg daily | Riverside, HomeLog, Lakeview prose | Sensitive (Northgate marks BH restricted per README; HomeLog entry separately disclosable). |
| Insulin glargine (Lantus) 10 units at bedtime (12 if glucose > 200) | HomeLog only (started 2025-08-18) | Riverside said "no insulin at discharge" (2024). No clinic source in examples shows a prescriber: unverified, patient-reported. |
| Ibuprofen (Advil) 200-400 mg PRN, ~2x/week, OTC | HomeLog only | No clinic knows; relevant to CKD stage 3b/A3 and hyperkalemia. Flag. |

### On hold
- Finerenone 10 mg daily: ON HOLD since 2026-09-14 (K 5.8/5.7). Review date 2026-09-28 has passed; no later
  item says resume/stop, so remain "on hold". Northgate (README only) is stale; HomeLog (2026-05) predates it.

### Not active
- Empagliflozin: stopped. Riverside says `held` (stale, 2024-11-05); Northgate `stop` 2024-11-12 (adverse
  reaction); HomeLog stopped 2024-11. Lakeview says no SGLT2i for now, revisit later: so "do not restart" is
  currently "not now", while HomeLog says "never". Minor conflict.
- Lisinopril: stopped 2021 (cough).
- Lakeview shows no chlorthalidone/losartan orders; they are not in Lakeview's MED_ORDER table.

### Allergies / intolerances
- Lisinopril: cough (ACE-inhibitor), mild/low criticality. Northgate: `intolerance`, no angioedema ("no lip,
  tongue or throat swelling"). Riverside lists it under "Allergies" with severity mild (no intolerance category).
  HomeLog: "made me cough". Same fact in 3 sources: one entry, type intolerance, not true allergy.
- Empagliflozin (SGLT2 inhibitor): euglycemic DKA 11/2024. Northgate records it as an `adverse_reaction` (high
  criticality) per README, but I could not see that event in examples; Riverside records it as a diagnosis
  (E11.10 + T38.3X5A), not an allergy. Include as adverse reaction, high criticality; also Lakeview's prose.
- No known true drug allergies (Riverside H&P lists only lisinopril; no NKDA entry seen).

### Conflicts to note
1. Empagliflozin: held vs stopped vs "never again" vs "not for now".
2. CKD stage: Northgate 3a (stale 2022) vs Lakeview G3b/A3 (2026-07-13, eGFR 41, UACR 320).
3. Lantus and Advil only in the patient's list.
4. Chlorthalidone identity in HomeLog is a guess.
5. HomeLog metformin: 500 mg tablets vs 1000 mg: same daily dose.

---------------------------------------------------------------------------------------------------

## 7. Ratings and effort

| Source | Readability (1-5) | Reason | Tool calls spent |
|---|---|---|---|
| Riverside | 4 | Clear docstrings, readable prose; the `held` ambiguity and duplicate snapshots need care | ~5 (README+schema, 3 examples, H&P status grep) |
| Northgate | 3 | Excellent schema docs, but the examples are single events and cannot demonstrate the replay; much of the trap list is README-only | 2 |
| Lakeview | 4 | Dense but every code documented; cross-item joins (RX_ID, REPLACED_BY) and missing referenced items hurt | 2 |
| HomeLog | 5 | Simplest, patient-voice, schema precise; only judgments (unverified identity of meds) | 2 |
| Spec (record-item + schema-conventions) | 4 | Normative, clear, good examples of corrections; missing: signing.md, no guidance on how a reader finds the replacing item without the whole log, `effective` for date-only vs local date, and no statement on whether `sha256: "TODO"` items are valid | 2 (both read once) |

Total about 13 tool calls including the 2 spec reads.
