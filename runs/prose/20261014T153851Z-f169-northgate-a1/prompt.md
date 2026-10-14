# Task

You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from Northgate Family Medicine (primary care event log). Its structured data already exists; you write only the human-readable note text that goes with it.

## How this source writes

A primary-care practice. Prose is terse: what the clinician typed into a comment box or a short visit note.
Visit notes: a few short lines, abbreviations are normal (pt, f/u, RTC 3 mo, BP, A1c, HTN, DM2, CKD). No headings, no bold section labels. Mention what was decided today.
Event comments (medication, problem, allergy events): one or two short lines, usually the whole comment is the span, e.g. `<ref id="med_1">eGFR 41 on 2/9. Metformin down to 500 mg BID.</ref> Pt informed by phone.`
Dates in prose are short US style (2/9, 11/2024). Referral letters are a short plain letter to the specialist.

## Reference notes from this source (other dates; for style only, do not copy their facts)

```markdown
Hosp f/u. Riverside 11/2–11/5, euglycemic DKA. Feels back to baseline, eating and drinking normally.

Empagliflozin stopped, entered as adverse reaction. Metformin and chlorthalidone continue per discharge.

<ref id="sick_day">sick day rules reviewed</ref>

RTC 3 mo.
```

```markdown
<ref id="med_1">eGFR 41 on 2/9. Metformin down to 500 mg BID (max 1000 mg/day at eGFR 30–44).</ref>
Pt informed by phone.
```

```markdown
<ref id="alg_1">Dry cough since ~April on lisinopril.</ref> No lip, tongue or throat swelling.
```

## Rules (a program checks every note; violations are sent back to you)

1. For every id in `refs` and `spans`, wrap the words about it in exactly one `<ref id="ID">…</ref>`. Use no other ids. Spans never nest and never cross a paragraph break or a list item.
2. `spans` have no structured data behind them, so the span's own words must say the `statement`.
3. Say every `mustInclude` fact somewhere in the note, in the author's words, keeping the numbers.
4. Never mention anything matching `forbidden`, not even to deny it.
5. Words matching `sensitive` may appear only inside the listed spans.
6. Markdown only: no HTML except the ref tags, no images, no frontmatter, no code fences. Write values like `<0.01` as they are.
7. If a `skeleton` is given, reproduce it exactly and replace each [words] with the text.
8. Use only the facts given (refs, spans, mustInclude, context, gist). You may add ordinary narrative texture (symptoms described in words, exam findings, reassurance, follow-up timing) but no new diagnoses, medications, doses, or lab values.
9. Keep to each request's `length`.
10. No signature lines, no "signed at" times, no ISO timestamps (2024-11-02T07:15); write dates and times the way this source does.
11. Don't state decisions about medications or problems beyond what the request gives; mention other listed medications only as they are listed.
12. Patients (HomeLog) write what they knew at the time, in plain words: no diagnosis they had not been given yet, no generic names in parentheses after a brand.

## Output

Write ONE file, `out/notes.md`, containing every note, each preceded by its header line exactly like this:

```
=== note: <key> ===
<note text>
```

Do not write anything else to out/. Reply "done" when the file is written.

## Requests (32)

```json
[
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-06-25 11:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Essential hypertension\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Essential hypertension",
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-06-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-06-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-06-25 11:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Type 2 diabetes mellitus\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Type 2 diabetes mellitus",
   "onset 2011",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-06-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-06-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-06-25 11:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Hyperlipidemia\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Hyperlipidemia",
   "onset 2013",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-06-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-06-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-06-25 11:12",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Primary osteoarthritis of knee\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Primary osteoarthritis of knee",
   "onset 2012",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-06-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-06-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-06-25 10:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/83, pulse 77, wt 170 lb",
   "eGFR 67 (today)",
   "K 4.7 (today)",
   "A1c 6.7% (today)",
   "LDL 76 mg/dL (today)"
  ],
  "forbidden": [
   "losartan: not started by 2019-06-25 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-06-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-06-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-06-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-06-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_32/0",
  "kind": "Allergy list comment",
  "when": "2019-11-04 09:33",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "alg_1",
    "about": "lisinopril: dry cough (intolerance)"
   }
  ],
  "spans": [],
  "mustInclude": [
   "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema)."
  ],
  "context": [
   "lisinopril intolerance: dry cough"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-11-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-11-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_5/1",
  "kind": "Medication event comment",
  "when": "2019-11-04 09:31",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 20 MG Oral Tablet 20 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "losartan: not started by 2019-11-04 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-11-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-11-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/0",
  "kind": "Medication event comment",
  "when": "2019-11-04 09:32",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start losartan potassium 50 MG Oral Tablet 50 mg QD; reason: ACE inhibitor cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: started 50 mg daily today (ACE inhibitor cough)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-11-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-11-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_23",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2019-11-04 09:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 137/84, pulse 67, wt 172 lb",
   "eGFR 67 (10/29)",
   "K 4.2 (10/29)",
   "UACR 9 mg/g (10/29)",
   "A1c 6.8% (10/29)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2019-11-04 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2019-11-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2019-11-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2019-11-04 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_34",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-04-21 12:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 141/83, pulse 64, wt 173 lb",
   "eGFR 65 (4/19)",
   "K 4.5 (4/19)",
   "A1c 6.8% (4/19)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-04-21 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-04-21 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-04-21 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2020-04-21 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_40",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-08-25 08:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 139/86, pulse 88, wt 170 lb",
   "eGFR 65 (today)",
   "K 4.5 (today)",
   "UACR 14 mg/g (today)",
   "A1c 7.1% (today)",
   "LDL 86 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2020-08-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2020-08-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2020-08-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: not started by 2020-08-25 (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_54",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-02-08 15:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 138/82, pulse 66, wt 173 lb",
   "eGFR 64 (today)",
   "K 4.4 (today)",
   "UACR 14 mg/g (today)",
   "A1c 6.7% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-02-08 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-02-08 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-02-08 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_61",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-07-14 12:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 137/77, pulse 69, wt 173 lb",
   "eGFR 64 (today)",
   "K 3.9 (today)",
   "UACR 19 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-07-14 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-07-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-07-14 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_68",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2021-11-29 10:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/89, repeat 139/89, pulse 69, wt 169 lb",
   "eGFR 64 (today)",
   "K 4.3 (today)",
   "UACR 16 mg/g (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2021-11-29 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2021-11-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2021-11-29 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_31/1",
  "kind": "Medication event comment",
  "when": "2022-04-25 15:31",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change losartan potassium 100 MG Oral Tablet 100 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-04-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-04-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-04-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_75",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-04-25 15:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/86, pulse 74, wt 172 lb",
   "eGFR 61 (today)",
   "K 4.4 (today)",
   "UACR 22 mg/g (today)",
   "A1c 6.9% (today)",
   "LDL 112 mg/dL (today)"
  ],
  "forbidden": [
   "chlorthalidone: not started by 2022-04-25 (pattern /\\b(chlorthalidone)\\b/i)",
   "insulin glargine: not started by 2022-04-25 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-04-25 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_93/0",
  "kind": "Medication event comment",
  "when": "2022-10-12 09:21",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start chlorthalidone 25 MG Oral Tablet 12.5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-10-12 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_86",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2022-10-12 09:00",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/83, repeat 143/79, pulse 64, wt 172 lb",
   "eGFR 63 (10/6)",
   "K 4 (10/6)",
   "A1c 7.1% (10/6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2022-10-12 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2022-10-12 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_94",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-03-28 08:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/76, pulse 75, wt 171 lb",
   "eGFR 62 (3/25)",
   "K 4.5 (3/25)",
   "UACR 20 mg/g (3/25)",
   "A1c 7.7% (3/25)",
   "LDL 88 mg/dL (3/25)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-03-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-03-28 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_108",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-08-10 12:40",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 125/77, pulse 88, wt 170 lb",
   "eGFR 61 (8/6)",
   "K 4.4 (8/6)",
   "UACR 26 mg/g (8/6)",
   "A1c 7.7% (8/6)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-08-10 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-08-10 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_116",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-12-18 15:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 135/89, pulse 68, wt 172 lb",
   "eGFR 62 (today)",
   "K 4.5 (today)",
   "UACR 30 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2023-12-18 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2023-12-18 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_124",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2024-06-14 11:10",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/81, pulse 62, wt 172 lb",
   "eGFR 59 (6/9)",
   "K 4.2 (6/9)",
   "A1c 7.5% (6/9)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-06-14 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-06-14 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_141/0",
  "kind": "Problem list comment",
  "when": "2024-10-28 16:25",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Chronic kidney disease stage 3a\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "onset 2024-10-28",
   "supporting result: eGFR 59 (6/9)",
   "supporting result: eGFR 56 (today)",
   "supporting result: UACR 30 mg/g (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-28 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-10-28 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_130",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2024-10-30 13:15",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 133/87, pulse 62, wt 168 lb",
   "eGFR 56 (10/28)",
   "K 3.6 (10/28)",
   "UACR 30 mg/g (10/28)",
   "A1c 7.6% (10/28)",
   "LDL 95 mg/dL (10/28)",
   "Chronic kidney disease stage 3a"
  ],
  "forbidden": [
   "insulin glargine: not started by 2024-10-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-10-30 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_142",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-04-15 08:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 143/82, repeat 140/82, pulse 74, wt 171 lb",
   "eGFR 53 (today)",
   "K 4.6 (today)",
   "UACR 32 mg/g (today)",
   "A1c 7.6% (today)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-04-15 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-04-15 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_149",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2025-10-03 12:50",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/84, pulse 74, wt 171 lb",
   "eGFR 50 (9/28)",
   "K 4.3 (9/28)",
   "A1c 8% (9/28)",
   "LDL 87 mg/dL (9/28)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2025-10-03 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2025-10-03 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_163",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2026-03-11 12:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 130/82, pulse 79, wt 169 lb",
   "eGFR 45 (3/8)",
   "K 3.8 (3/8)",
   "A1c 7.9% (3/8)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2026-03-11 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2026-03-11 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_180/0",
  "kind": "Medication event comment",
  "when": "2026-08-04 14:07",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start 3 ML insulin glargine 100 UNT/ML Pen Injector 10 units QHS; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-08-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2026-08-04 14:06",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change metformin hydrochloride 500 MG Oral Tablet 500 mg BID; reason: eGFR 41"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)"
  ],
  "forbidden": [
   "insulin glargine: not started by 2026-08-04 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2026-08-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/referral/rf_239/created",
  "kind": "Referral letter to Lakeview Kidney Care (Nephrology)",
  "when": "2026-08-04 14:30",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "80-160 words, a short letter",
  "refs": [
   {
    "id": "referral",
    "about": "referral: eGFR 41, UACR 40 mg/g: CKD evaluation and management"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Chronic kidney disease stage 3a",
   "Type 2 diabetes mellitus",
   "Essential hypertension"
  ],
  "forbidden": [
   "finerenone: not started by 2026-08-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_172",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-08-04 13:45",
  "author": "Jaya Patel, NP (Nurse practitioner)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: dose changed to 500 mg twice daily today (eGFR 41)",
   "insulin glargine: started 10 units at bedtime today (A1c 8.2)"
  ],
  "context": [
   "BP 147/83, repeat 145/79, pulse 63, wt 172 lb",
   "eGFR 43 (7/29)",
   "K 4.1 (7/29)",
   "UACR 47 mg/g (7/29)",
   "A1c 8.2% (7/29)"
  ],
  "forbidden": [
   "finerenone: not started by 2026-08-04 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/outside/m_247",
  "kind": "Medication reconciliation comment (phone)",
  "when": "2026-10-08 09:21",
  "author": "Nina Ortiz, RN (Registered nurse)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "finerenone 10 mg QD added from the outside (Lakeview) record"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily"
  ],
  "forbidden": [
   "naproxen: unknown to this source (pattern /\\b(naproxen|Aleve|NSAID)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
