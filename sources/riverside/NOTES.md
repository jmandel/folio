# Riverside (source A): decisions and problems found

> Stage 0c: the problems below were resolved (or left open) in `work/decisions.md` under "Stage 0c";
> see `work/stage0c-receipt.md` for what changed. This file is kept as the Stage 0b record.
> Stage 0e changed several values recorded below (see `work/stage0e-receipt.md`); the examples,
> schemas and `truth/` are authoritative.

## Story problems (truth/HERO.md, truth/TRAPS.md)

1. **Wrong UTC offset for the ED arrival.** HERO and T10 say 2024-11-01 21:40 local = `2024-11-02T03:40Z`.
   Daylight time was still in effect on 2024-11-01 (it ended 2024-11-03 02:00), so 21:40 CDT is
   `2024-11-02T02:40Z`. I kept the local time (21:40) and used `02:40Z`. HERO and TRAPS should be
   corrected. A bonus: the offset changes mid-stay (UTC-5 before 11/03, UTC-6 after), which the
   examples use.
2. **T7 says "A stores 212 labelled 10\*3/uL".** 212 is the Lakeview 2025-08-18 value; Riverside only
   sees the 2024 admission. I gave the ED CBC its own platelet count, `"268"` `10*3/uL`. The truth needs
   this value; T7 should say A shows the unit convention, not the same number.
3. **Values HERO does not give, chosen here** (the truth model needs them): chloride 94/99/101,
   BUN 31/19/14, creatinine 1.41 / 1.36 / 1.33 mg/dL, eGFR 43 / 45 / 46 (CKD-EPI 2021, computed for
   age 59), bicarbonate 21 and anion gap 11 on 11/03, sodium 131 on 11/03, K 4.2 / 4.3,
   beta-hydroxybutyrate 2.1 (11/02 PM) and 0.3 (11/03 AM), venous pCO2 24, WBC 14.2, Hgb 14.1, vitals,
   weights, admission 11/02 01:30 local, discharge 11/05 11:30 local, insulin infusion 11/01 23:05 to
   11/03 04:30, lispro correction scale from 11/03. Anion gaps are consistent with Na − (Cl + HCO₃).
4. **In-hospital eGFRs enter the eGFR series.** A's three eGFRs (43–46, mildly dehydrated) sit between
   Lakeview's 49 (2023-03) and 41 (2026-02). The lab-series key and the decline-rate cohort should say
   whether inpatient values count. I'd keep them (they are real results) and let cohort 1 use
   outpatient values only.
5. **Losartan and atorvastatin during the stay.** HERO is silent; I continued both throughout (the
   minimal choice). A real hospitalist might hold losartan with K 5.0 and volume depletion.
6. **"Kept taking empagliflozin while sick" stays P-only.** A real H&P would record the last dose. To keep
   the fact P-only, the H&P says she "could not say which of her pills she kept down". Worth revisiting:
   it makes A slightly less realistic in exchange for a cleaner T13.
7. **Gastroenteritis is not coded.** A coder would usually add A08.4; leaving it out keeps the precipitant
   prose-only (T13), as HERO asks. If we want realism here, T13's precipitant could move to "poor oral
   intake", which hospitals rarely code.
8. **Document count.** TRAPS T15 counts six documents (ED, H&P, 3 progress notes, discharge). With the
   endocrinology consult HERO implies, the stay has seven. Examples cover four; progress notes are left
   to the Stage 1 renderer.
9. **Endocrinology's advice foreshadows the re-challenge question** ("if her nephrologist later wants an
   SGLT2 inhibitor … written sick-day guidance in place first"). It is consistent with Lakeview's 2026
   decision but makes the nephrology intake question partly answerable from A. Drop the second sentence
   if that's too much help.

## Modeling decisions

- **One item per signed document, not per encounter.** Documents are what a hospital signs and amends;
  an encounter is shared context, carried in an `encounter` entry with `encounter_id`.
- **Flat top level, nesting only for panels.** The brief suggested encounter entries holding diagnoses,
  med lists and results. That would make the whole encounter one disclosable unit, so sertraline could
  not be withheld without withholding every med (T19). Anything a patient might withhold, or a reader
  might cite, is its own top-level entry; only panel components are nested.
- **`effective` per document kind** is documented in the schema's module comment. The discharge summary
  uses admission time with `effective_end` = discharge, so sorting by `effective` puts it before the
  H&P. Readers looking for "latest discharge list" should use `effective_end` or `recorded`.
- **Times are UTC everywhere in the payload and envelope**, local in prose. This is the T10 trap; the
  schema says so up front.
- **RxNorm ingredient CUIs only**, not clinical-drug codes: strength lives in text fields. Chlorthalidone
  is "25 mg tablet", dose "12.5 mg", sig "1/2 tab", which a mapper must not read as 25 mg.
- **Entry keys look stable across documents but are not promised to be.** The examples reuse readable
  keys (`med_empa`) per document; the schema tells mappers to match by ingredient and dose instead.
- **ICD-10-CM K85.90 stays on the ruled-out pancreatitis entry.** That's realistic (coders and
  problem pickers attach codes) and is the point of T12: code-only filters must check `status`.
- **Code values need verification** before publication: RxNorm ingredient CUIs (6809, 1545653, 52175,
  2409, 83367, 36437, 29046, 253182, 86009) and LOINC codes (notably 33037-3 anion gap, 2746-6 / 2021-4
  venous pH / pCO2, 58410-2 CBC panel). I'm confident of most but did not check them against the
  terminology files.

## Spec problems

1. **Nesting vs disclosure (schema-conventions.md).** The conventions say nesting is fine where the source
   nests, but the disclosure unit is a top-level entry. The spec should say: anything that should be
   separately withholdable or citable must be a top-level entry. Otherwise sources will nest naturally
   and lose fine-grained disclosure.
2. **Narrative-only spans as citation anchors (record-item.md).** The spec motivates narrative-only spans
   only as withholdable prose. `precipitant` is not sensitive; it exists so an agent can cite
   (item id, ref id) for a prose-only fact (T13, Stage 5/6). Say so.
3. **Leaking through unspanned prose.** Prose outside spans is always disclosed. Writing "Depression:
   stable on sertraline" as one span would make it impossible to disclose sertraline without depression,
   which is exactly the HERO exchange. The H&P splits it into `hx_mdd` and `med_sertraline` spans. The
   spec (or a signing.md note for issuers) should warn authors that span boundaries are disclosure
   boundaries.
4. **Time zone of the clinical date.** The envelope can be UTC (`Z`), but readers need the local date for
   "which day was the ED visit". There is no envelope hint of the issuer's zone; it lives in the schema
   docstring. Fine for now, but an optional `tz` (IANA name) in the envelope, or a recommendation to use
   local offsets in `effective`, would remove a whole trap class. (Riverside keeps `Z` on purpose.)
5. **Literal `<` in narrative.** `Troponin I <0.01` is valid CommonMark text and the spec only escapes
   `<ref`. Fine, but a ref-span parser must match `<ref id="` exactly, not any `<`. Worth one sentence.
6. **Copies of the same fact inside one issuer.** The spec covers supersession between items but not
   "the same result copied into many items" (T14 within one source). Not a spec change, but the
   schema-conventions page could recommend that sources say how to dedupe copies (here: `accession` +
   `test.local_code`, most advanced status wins).
