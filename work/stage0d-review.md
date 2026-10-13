# Stage 0d review: codes, clinical plausibility, consistency, traps, spec

Adversarial review of `spec/`, `truth/` and `sources/*` after Stage 0c. Not committed.
`bun work/check-examples.ts` still passes (22 payloads, 0 problems) after the fixes below.

## 1. Fixed in place

| File | Was | Now | Why |
|---|---|---|---|
| `sources/homelog/examples/2026-05-02-my-medicines.folio.md` `med_5` | rxnorm `312941`, display "sertraline 100 MG Oral Tablet" | `312938` | RxNav: 312941 = *sertraline 50 MG Oral Tablet*; 312938 = sertraline 100 MG Oral Tablet (SCD). |
| same file, `med_6` | rxnorm `261551`, display "insulin glargine 100 UNT/ML" | `847230`, display "3 ML insulin glargine 100 UNT/ML Pen Injector" | 261551 = *Lantus* (BN, brand name only), so the display text did not match the code. The schema says a picked product carries ingredient + strength + form, and her `strength_text` says "pen". 847230 is the active SCD for the pen. |

Those were the only occurrences of either code anywhere in the repo.

### Codes checked and correct

Checked against RxNav, NLM Clinical Tables (LOINC, ICD-10-CM) and tx.fhir.org (SNOMED).

- **RxNorm IN:** 6809 metformin, 29046 lisinopril, 52175 losartan, 2409 chlorthalidone, 83367 atorvastatin,
  36437 sertraline, 1545653 empagliflozin, 86009 insulin lispro, 253182 insulin regular human.
- **RxNorm SCD:** 1545658 empagliflozin 10 MG Oral Tablet, 861007 metformin HCl 500 MG Oral Tablet,
  314077 lisinopril 20 MG Oral Tablet (spec example).
- **LOINC:** 2160-0, 4548-4, 6690-2, 718-7, 777-3, 2951-2, 2823-3, 2345-7, 9318-7, 51990-0, 2075-0, 2028-9,
  33037-3, 3094-0, 98979-8 (CKD-EPI 2021), 2746-6 (venous pH), 2021-4 (venous pCO2), 10839-9 (troponin I),
  58410-2 (CBC panel), 3040-3 (lipase).
- **LOINC 48642-3 / 48643-1** are the MDRD non-Black and Black codes, as TRAPS T11 intends: Lakeview maps
  its CKD-EPI 2009 rows to the wrong codes on purpose. The matching CKD-EPI 2009 codes are 88294-4 and
  88293-6, which `sources/lakeview/NOTES.md` §2 mentions. That note is the outdated Stage 0b position.
- **ICD-10-CM:** N18.31, N18.32, E11.22, E11.9, E11.10, I10, I12.9, E87.1, Z86.39, T38.3X5A, K85.90, F33.0,
  Z09 all match their stated meaning.
- **SNOMED:** 700378005 = Chronic kidney disease stage 3A.

## 2. Findings, ranked by severity

### High (the answer keys or a trap's premise would be wrong)

1. **T3 and T7 have no Northgate (B) example, and T3's redraw is missing from Lakeview (C) too.** The
   numbers T3 is about (K 6.1 corrected to 4.6) appear only as the withdrawn 6.1 row and a comment.
   - Not in any example: the K 4.6 redraw row, B's corrected copy, B's `212000 cells/uL` platelet
     import, and C's 2026-09-14 result rows 5.8/5.7 with `REPEAT_REASON 'CONF'`.
   - A Stage 1 mapper author working from the examples cannot see the confirmation-vs-correction
     contrast or B's unit rewrite. See the table in section 4.
2. **Latest creatinine and eGFR in HERO are probably stale.**
   - The nephrology plan on 2026-07-13 says "K and creatinine in 4 weeks", and HERO records the
     2026-08-10 K 5.2. Yet HERO's "Latest labs" still gives Cr 1.45 / eGFR 41 from 2026-02-09.
   - A creatinine would also normally come with the 2026-09-14 potassium draws.
   - Either add creatinine/eGFR values for 2026-08-10 (and probably 2026-09-14) to the truth, or say
     that only K was drawn. As it stands, the "latest labs" key contradicts the clinic's own plan.
3. **Finerenone is started with no baseline potassium on record.**
   - The label says check K before starting and do not start if K > 5.0. The last K anywhere is
     4.3 (Riverside, 2024-11-05).
   - The 2026-02-09 "renal panel" has creatinine, sodium, UACR and A1c but no potassium. That is odd
     for a CKD 3b patient on losartan plus chlorthalidone.
   - Fix: add K to the 2026-02-09 requisition (for example 4.7), or add a pre-visit K. Note that 4.7
     is close to the 4.8 cutoff in FIDELIO, which suits the later hyperkalemia story.

### Medium (clinical implausibility a clinician reviewer would flag)

4. **Insulin infusion stopped with no subcutaneous overlap (endocrine consult).**
   - The drip stopped at 04:30 CST; correction-scale lispro started at 08:15; no basal insulin was
     given. Standard DKA practice (the ADA hyperglycemic-crisis consensus) is to give subcutaneous
     basal insulin 1–2 h or more before stopping IV insulin, and SGLT2i-associated ketosis tends to
     come back.
   - Also, the consult says the drip was stopped "after the gap closed", but the only closed-gap BMP
     (`bmp_am`, AG 11) was collected at 06:10 CST, after the stop.
   - Fix: stop the drip around 08:30 CST, after the 06:10 BMP, with glargine given about 2 h before,
     or keep the times and mention an earlier BMP. If basal insulin is added, the discharge line "No
     insulin at discharge" still holds.
5. **Venous blood gas does not balance.** pH 7.21 with HCO₃ 11 and pCO₂ 24 gives pH ≈ 7.28 by
   Henderson–Hasselbalch. Venous pCO₂ ≈ 28 gives 7.21 and is still a compensated value (Winter's
   formula, arterial, gives 24.5 ± 2; venous runs a few mmHg higher). Suggest changing `VPCO2` to "28"
   in the ED note.
6. **Metformin 1000 mg BID continues at eGFR 41** (2026-02 onward) and the nephrologist does not
   comment. KDIGO 2022 / FDA labelling reduce the dose to at most 1000 mg/day for eGFR 30–44. Either
   have the 2026-07-13 visit halve it (a new fact that changes the active-meds key), or accept it as
   realistic inertia and say so in HERO.
7. **Finerenone is added on top of submaximal RAS blockade.** She is on losartan 50 mg with BP 136/82 and
   A3 albuminuria. KDIGO says to maximise ACEi/ARB first, and FIDELIO required a maximum tolerated dose.
   It is plausible if the reason is potassium caution, but the note should say why (one clause).
8. **Lakeview note puts sertraline in prose outside any span** ("sertraline (disclosed at intake) may
   contribute"). This breaks record-item.md "a sensitive fact MUST NOT appear in prose outside any span".
   Sertraline is the behavioral-health-sensitive med the whole T19 story hangs on. Fix: wrap it in a
   narrative-only span (e.g. `na_sertraline`) or inside the `dx_na` span. Lakeview NOTES §7 relies on
   this prose being the only place C mentions home meds.
9. **Northgate `visit.billing_dx` nests diagnoses inside a visit entry.** record-item.md says "An
   encounter or document entry MUST NOT nest the medication list, diagnoses or other lists whose
   members a patient might disclose separately". A behavioral-health visit would carry F33.0 inside
   the `visit` entry. Fix: make each billing diagnosis its own top-level entry with `visit_id`, or
   narrow the spec rule to sensitive members (the spec text is categorical as written).
10. **Losartan continued through hypovolemic euDKA.** BP was 104/62, BUN 31, K 5.0 and creatinine above
    baseline, and sick-day rules (which the follow-up note says were taught) hold ARBs in exactly this
    situation. Riverside NOTES §5 already flags this. It is plausible, but holding it would be more
    typical.

### Low

11. **HERO 2021-01-14 "computed 65 / 76"** should be **65 / 75**. CKD-EPI 2009, Cr 0.98, age 55, female:
    non-Black 64.9, Black 75.2. The same error is in `sources/lakeview/NOTES.md` §3. Both print ">60",
    so nothing downstream changes.
12. **eGFR recomputations are otherwise all correct.**

    | Date | Cr | Age | CKD-EPI 2021 | 2009 non-Black / Black | Stated |
    |---|---|---|---|---|---|
    | 2021-01-14 | 0.98 | 55 | 68.2 | 64.9 / 75.2 | 68; ">60" |
    | 2021-09-20 | 1.12 | 56 | 57.7 | 54.9 / 63.6 | 58; 55 / 64 |
    | 2022-02-07 | 1.18 | 56 | 54.2 | | 54 |
    | 2024-11-01 | 1.41 | 59 | 43.0 | | 43 |
    | 2024-11-03 | 1.36 | 59 | 44.9 | | 45 |
    | 2024-11-05 | 1.33 | 59 | 46.1 | | 46 |
    | 2026-02-09 | 1.45 | 60 | 41.3 | | 41 |

    2023-03-06 with Cr 1.28 at age 57 gives 48.9, which matches HERO's 49. MDRD would give 50/61 on
    2021-09-20, so the stated values are genuinely CKD-EPI 2009 and the MDRD LOINC trap holds.
13. **Electrolytes check out.**
    - Anion gaps match Na − (Cl + HCO₃) on all three BMPs.
    - Glucose-corrected sodium on arrival is about 130 (×1.6) or 131 (×2.4), so true hyponatremia
      stands.
    - K 5.0 → 4.2 on insulin is plausible. No KCl in the fluids is documented; a K of 5.0 is at the
      usual threshold for adding it.
    - The hemolyzed K 6.1 → 4.6 redraw and the finerenone thresholds are handled as the label says:
      continue at 4.8–5.5, hold above 5.5, recheck.
14. **CKD 3a diagnosis (2022-02-07) leans on the non-Black eGFR.** The PCP cites "eGFR 55 in 9/2021" for a
    Black patient whose Black-coefficient value was 64. Chronicity still holds under CKD-EPI 2021 (58 → 54),
    so it is realistic, but it is a nice extra wrinkle the TRAPS text could mention under T11.
15. **Smaller clinical points.**
    - The ED note recorded at 01:10 local still says "lipase pending" for a sample drawn at 21:58.
      That is slow, but OK.
    - `bhb_2` at 12:05 CDT is called "yesterday afternoon".
    - There is no inpatient A1c, and no GLP-1 RA is considered despite A1c 8.2–8.6 with the SGLT2i
      ruled out (a typical KDIGO/ADA reviewer remark).
    - Finerenone `START_DATE` 2026-07-14 vs HERO "2026-07-13 finerenone started". Decide which is the
      truth date.
16. **Advil `my_med` has no `started`**, while HERO says "taking since about 2025". Add `"started": "2025"`
    or drop the claim from HERO.
17. **All `schema.sha256` are `"TODO"`**, which breaks spec "lowercase hex". The checker does not flag it.
18. **NPIs fail the NPI Luhn check** (1999000017, 1999000042, and the spec's 1952384017). Fine for
    synthetic data, and arguably good (they can never collide with real NPIs), but a validator that
    checks NPIs would reject them. Worth one line in decisions.md.

## 3. Cross-source consistency

Checked and consistent:

- Patient ids within each issuer.
- Local ↔ UTC conversions, including the DST change on 11/03:
  - Riverside: 21:40 CDT = 02:40Z; admitted 01:30 = 06:30Z; drip 23:05 = 04:05Z; stop 04:30 CST =
    10:30Z; discharged 11:30 CST = 17:30Z.
  - Northgate and Lakeview offsets are correct for every date.
- Accession day-of-year numbers (LV21-014, LV21-263, LV22-255, LV25-230, LV26-040, L24306/307/308/310).
- ULID timestamps match `recorded`, and superseded/retracted ids decode to plausible earlier times:
  K original 11:42 CDT; My Medicines 2026-03-28; atorvastatin 2025-11-03.
- Medication names and doses across A/B/P, start dates on the P list, ages (59 in 2024), and the
  Na 129 → 133 → 132 series.

Mismatches:

- **Finerenone start date:** C `START_DATE` 2026-07-14 vs HERO 07-13 (Low 15).
- **Ibuprofen start date:** HERO says since about 2025; P carries no `started` (Low 16).
- **eGFR 2021-01-14:** HERO and Lakeview NOTES say 76 instead of 75 (Low 11).
- **Latest creatinine:** HERO's latest-labs entry vs the nephrology plan (High 2).
- **`bhb_3` status:** "preliminary" in the consult, "final" in the discharge summary. This is intended
  (Riverside README T14, "sometimes with different statuses"), but TRAPS T14 does not mention
  within-A status drift. Add it so the key states that the most advanced status wins.
- **Document count:** TRAPS T15 counts 7 Riverside documents; there are 4 examples. Expected, since
  progress notes are left to Stage 1.

## 4. Traps vs examples

| Trap | Where it appears in examples | Status |
|---|---|---|
| T1 held vs discontinued | A discharge `med_empa` `held` + "would not restart"; B empagliflozin `stop`; C `MED_STATUS_HIST` 1→3 while 07-13 `MED_ORDER` says 1 | present, except B's stale outside finerenone line (prose only) |
| T2 two status axes | C 2022-09-12: `ORDER_STATUS` 4, `RESULT_STATUS` 'C' | present |
| T3 superseded vs confirmed | C 2022-09-12 supersedes the original and restates 6.1 as 'C' with `REPLACED_BY_RESULT_ID` | partial: no 4.6 redraw item, no B corrected copy, and 2026 5.8/5.7 only as note prose and a `COMMENT_TEXT`, with no result rows |
| T4 entered in error | C 2025-08-18 A1c dup `ORDER_STATUS` 9 with 'F' result; B atorvastatin `retracts` | present (the retracted B original is not shown) |
| T5 stale problem list | B 2022-02-07 CKD 3a; C 2026-07-13 N18.32 / G3b | present; B `list_reviewed` is prose only |
| T6 glucose units | P 2023-04-11 7.8 mmol/L; P 2024-02-10 8.1 mmol/L + 162 mg/dL | present |
| T7 platelets ×10³ | A "268" `10*3/uL`; C "212" `K/uL` | partial: B `212000 cells/uL` is prose only |
| T8 | dropped | n/a |
| T9 text values, sentinel | C ">60"/9999999; A troponin "<0.01"; B "55"/"64" as text | present (B ">60" import is prose only) |
| T10 time zones, date-only | A 02:40Z and DST shift; P zone-less times; B date-only `effective` | partial: B year-precision onsets (HTN 2014, T2DM 2016) are prose only |
| T11 eGFR equation | C 2021-01-14 two rows with MDRD LOINCs; B 2021-09-20 two rows; C 2026 `LK-EGFR21` no LOINC; A 98979-8 | present |
| T12 negation, rule-outs | A "R/O pancreatitis" working → ruled_out K85.90; "No evidence of ACS"; B "No lip, tongue or throat swelling" | present |
| T13 prose-only | A `precipitant` (H&P, DC); P "still taking my pills"; B `sick_day`; C `sglt2_decision`; P glargine "12 if…"; P OTC Advil | present |
| T14 duplicates | A BMP/BHB copied across documents; B 2021-09-20 import with `external_ref.accession` | partial: the C original LV21-263-00417 is not an example, so no cross-source pair is visible |
| T15 med-list re-snapshot | All 4 A documents re-list 6 home meds with varying status | present |
| T16 local codes | C `LK-EGFR21` no LOINC, 2022 `LK-K` no LOINC, 2026 `LK-UACR` with LOINC; C finerenone `LV_DRUG_ID` only; A BHB no LOINC; A E11.10 + `RRH-DX-4471` | present; B outside finerenone line is prose only |
| T17 fuzzy onset | B lisinopril onset `{date:"2021-04-01", precision:"month"}` | partial: the shape is shown, but the HTN `2014-01-01`/`year` instance TRAPS names is prose only |
| T18 two shapes | A DKA diagnosis + T38.3X5A; A lisinopril on allergy list; B lisinopril `intolerance` | partial: B empagliflozin `adverse_reaction` allergy_event is prose only (the note says "entered as adverse reaction") |
| T19 redaction | A `hx_mdd` / `med_sertraline` separate spans and entries; P `med_5` | present; B `restricted: "BH"` is prose only. C's unspanned sertraline mention undercuts it (Medium 8) |

To close the gaps, add the following Stage 0 examples:

- **B:**
  - The 2022-09-12 K import and its superseding corrected copy (T3).
  - The 2025-08-18 platelet import (T7).
  - The empagliflozin `allergy_event` `adverse_reaction` (T18).
  - The 2026-07-20 outside finerenone `med_event` (T1/T16).
  - The HTN `problem_event` with year precision (T10/T17).
- **C:**
  - The 2022-09-12 redraw requisition (T3).
  - The 2026-09-14 K requisitions with `REPEAT_REASON 'CONF'` (T3).

## 5. Spec vs examples

- **Lakeview 2026-07-13:** sensitive fact (sertraline) in unspanned prose. Breaks a MUST (Medium 8).
- **Northgate `visit.billing_dx`:** diagnoses nested in an encounter entry. Breaks a MUST (Medium 9).
- **All items:** `schema.sha256: "TODO"` is not lowercase hex (Low 17).
- **Checked with no problems found:**
  - Envelope field order and time forms.
  - Zone-less times only in HomeLog payloads, with a date `effective`.
  - Superseding items keep the clinical `effective` and restate all content.
  - The retraction item has `effective == recorded`.
  - Spans stay within one paragraph or list item and do not nest.
  - Repeated span ids (`med_empa`, `precipitant`) are allowed by the spec.
  - Narrative-only spans are documented.
  - `Troponin I <0.01` inside a span is legal.
  - HomeLog's generated narrative is declared in its schema.
  - Panels are the only nesting in Riverside.
