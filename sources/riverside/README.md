# Source A: Riverside Regional Hospital

A community hospital with an emergency department, inpatient medicine and specialty consult services.
It publishes **signed clinical documents**: one record item per ED note, admission H&P, progress note,
consult or discharge summary. Issuer `did:web:riverside-regional.example`; schema
[`schema/riverside-doc-v1.d.ts`](schema/riverside-doc-v1.d.ts), entry type `RiversideEntry`.

## Modeling style

- **The document is the unit.** The narrative is the note the clinician signed; the payload holds the
  structured parts of that note. Documents of one hospital stay share an `encounter_id`.
- **Every document re-lists everything.** Home medications, allergies and diagnoses are re-entered in
  each document with that document's status. The discharge summary has the final word.
- **Results are copies.** Labs appear only inside the documents that reviewed them, as text values with
  the lab's display (`"<0.01"`). One result can appear in several items, identified by `accession`.
- **UTC in the payload, local time in the prose.** The hospital is in America/Chicago.
- **Rich prose, many ref spans.** Most decisions are spelled out in the narrative; a few facts (the DKA
  precipitant) exist only there, as narrative-only spans.

## Entry types

`encounter`, `diagnosis`, `history`, `allergy`, `home_med`, `inpatient_med`, `vitals`, `result`,
`panel`, `follow_up`.

## Examples (hero: Linda Okafor, MRN RRH-00731846)

| File | Document |
|---|---|
| [2024-11-01-ed-note](examples/2024-11-01-ed-note.folio.md) | ED note: euglycemic DKA, R/O pancreatitis, meds listed but not reconciled |
| [2024-11-02-admission-hp](examples/2024-11-02-admission-hp.folio.md) | H&P: precipitant, pancreatitis ruled out, meds held |
| [2024-11-03-endocrine-consult](examples/2024-11-03-endocrine-consult.folio.md) | Consult: DKA resolved, advises against SGLT2 inhibitors |
| [2024-11-05-discharge-summary](examples/2024-11-05-discharge-summary.folio.md) | Discharge: empagliflozin held, "I would not restart it" |

File names use the local clinical date; the ED note's `effective` is `2024-11-02T02:40:00Z`.

## Traps that live here

| Trap | How it shows up |
|---|---|
| T1 held vs discontinued | Discharge summary: empagliflozin `status: "held"` with `restart_advice: "advise_against"` ("I would not restart it"): held, not stopped, because her PCP decides. Northgate stops it a week later. Other held lines (metformin, losartan, chlorthalidone in the H&P) carry `"resume_when_able"`. |
| T7 platelets | Stored as `"268"` with unit `10*3/uL`. |
| T9 text values | Every lab value is a string; troponin is `"<0.01"`. |
| T10 time zones | ED arrival 21:40 local on 11/01 is `2024-11-02T02:40:00Z`; daylight time ends mid-stay (UTC-5 to UTC-6 on 11/03). |
| T12 negation, rule-outs | "R/O pancreatitis" (`working`) becomes `ruled_out` but keeps its ICD-10 code K85.90; "No evidence of ACS" is prose only. |
| T13 prose-only facts | The DKA precipitant (gastroenteritis, poor intake) is a narrative-only span `precipitant` in the H&P and discharge summary. |
| T14 duplicates | The same BMP and beta-hydroxybutyrate results are copied into several documents, sometimes with different statuses. |
| T15 med-list re-snapshot | All six home meds (including sertraline) appear in each of the four documents, each time with that document's status (metformin: not reconciled → held → held → continue). |
| T16 local codes | Beta-hydroxybutyrate has no LOINC; SGLT2i-associated DKA is E11.10 plus local `RRH-DX-4471`. |
| T18 one reaction, two shapes | DKA is a diagnosis (E11.10 plus adverse-effect code T38.3X5A), never an allergy; lisinopril cough sits on the allergy list because Riverside has no intolerance category. |
| T19 redaction | Sertraline (`med_sertraline`) and depression (`hx_mdd`) are separate entries and separate spans, so either can be withheld alone. |
