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

## Requests (34)

```json
[
 {
  "key": "B/med/m_18/0",
  "kind": "Medication event comment",
  "when": "2019-03-07 11:11",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dapagliflozin 10 MG Oral Tablet 10 mg QD; reason: A1c 8.2"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_1/0",
  "kind": "Problem list comment",
  "when": "2019-03-07 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_2/0",
  "kind": "Problem list comment",
  "when": "2019-03-07 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2007-12",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_3/0",
  "kind": "Problem list comment",
  "when": "2019-03-07 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "onset 2016",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_4/0",
  "kind": "Problem list comment",
  "when": "2019-03-07 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Obesity\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Obesity",
   "onset 2016-09",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/problem/c_5/0",
  "kind": "Problem list comment",
  "when": "2019-03-07 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "prob_1",
    "about": "add problem \"Major depressive disorder, recurrent, mild\""
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "Major depressive disorder, recurrent, mild",
   "onset 2014-02-21",
   "added at the first visit to this practice; the history is per the patient"
  ],
  "forbidden": [
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": [
   {
    "words": "/depress|\\bMDD\\b|F33/i",
    "onlyInsideSpans": [
     "prob_1"
    ]
   }
  ]
 },
 {
  "key": "B/visit/e_10",
  "kind": "Primary care office visit note (reason: New patient, establish care)",
  "when": "2019-03-07 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dapagliflozin: started 10 mg daily today (A1c 8.2)"
  ],
  "context": [
   "BP 149/92, repeat 141/90, pulse 68, wt 177 lb",
   "eGFR 75 (today)",
   "K 4.4 (today)",
   "UACR 50 mg/g (today)",
   "A1c 8.2% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-03-07 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-03-07 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-03-07 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-03-07 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/1",
  "kind": "Medication event comment",
  "when": "2019-07-18 09:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "change lisinopril 40 MG Oral Tablet 40 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-07-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-07-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-07-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_19",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-07-18 08:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: dose changed to 40 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 150/91, pulse 64, wt 178 lb",
   "eGFR 75 (7/12)",
   "K 3.9 (7/12)",
   "UACR 48 mg/g (7/12)",
   "A1c 7.4% (7/12)",
   "LDL 76 mg/dL (7/12)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-07-18 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-07-18 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-07-18 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-07-18 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/allergy/a_41/0",
  "kind": "Allergy list comment",
  "when": "2019-12-24 11:23",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_6/2",
  "kind": "Medication event comment",
  "when": "2019-12-24 11:21",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "stop lisinopril 40 MG Oral Tablet 40 mg QD; reason: dry cough"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "lisinopril: stopped today (dry cough)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "losartan: not started by 2019-12-24 (pattern /\\b(losartan|Cozaar)\\b/i)",
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/0",
  "kind": "Medication event comment",
  "when": "2019-12-24 11:22",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_30",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2019-12-24 11:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "lisinopril: stopped today (dry cough)",
   "losartan: started 50 mg daily today (ACE inhibitor cough)",
   "lisinopril intolerance: dry cough"
  ],
  "context": [
   "BP 131/77, pulse 80, wt 176 lb",
   "eGFR 73 (today)",
   "K 4.2 (today)",
   "A1c 7.3% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2019-12-24 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2019-12-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2019-12-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_43",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2020-04-30 14:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 142/81, pulse 82, wt 178 lb",
   "eGFR 74 (today)",
   "K 4.2 (today)",
   "A1c 6.9% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-04-30 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-04-30 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-04-30 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_40/1",
  "kind": "Medication event comment",
  "when": "2020-10-12 14:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-10-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-10-12 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_52",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2020-10-12 13:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "losartan: dose changed to 100 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 145/85, pulse 71, wt 176 lb",
   "eGFR 73 (today)",
   "K 4.3 (today)",
   "UACR 47 mg/g (today)",
   "A1c 7.1% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "chlorthalidone: not started by 2020-10-12 (pattern /\\b(chlorthalidone)\\b/i)",
   "amlodipine: not started by 2020-10-12 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2020-10-12 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_71/0",
  "kind": "Medication event comment",
  "when": "2021-03-24 15:06",
  "author": "Teresa Reyes, MD (Primary care physician)",
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
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2021-03-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2021-03-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_60",
  "kind": "Primary care office visit note (reason: Annual exam)",
  "when": "2021-03-24 14:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "chlorthalidone: started 12.5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/81, pulse 63, wt 175 lb",
   "eGFR 72 (today)",
   "K 4.3 (today)",
   "UACR 49 mg/g (today)",
   "A1c 7.5% (today)",
   "LDL 60 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "amlodipine: not started by 2021-03-24 (pattern /\\b(amlodipine|Norvasc)\\b/i)",
   "dulaglutide: not started by 2021-03-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_79/0",
  "kind": "Medication event comment",
  "when": "2021-09-13 11:36",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start amlodipine 5 MG Oral Tablet 5 mg QD; reason: BP above goal"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2021-09-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_72",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2021-09-13 11:15",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "amlodipine: started 5 mg daily today (BP above goal)"
  ],
  "context": [
   "BP 143/81, pulse 88, wt 176 lb",
   "eGFR 76 (9/7)",
   "K 4.5 (9/7)",
   "A1c 7.2% (9/7)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2021-09-13 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_80",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-02-24 08:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/80, pulse 66, wt 179 lb",
   "eGFR 70 (today)",
   "K 4.5 (today)",
   "UACR 37 mg/g (today)",
   "A1c 7.6% (today)",
   "LDL 65 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2022-02-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_92",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2022-07-19 12:00",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/79, pulse 65, wt 181 lb",
   "eGFR 73 (today)",
   "K 4.4 (today)",
   "A1c 7.5% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2022-07-19 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_98",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2022-12-28 12:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 121/78, pulse 81, wt 176 lb",
   "eGFR 74 (12/26)",
   "K 4.4 (12/26)",
   "A1c 8% (12/26)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2022-12-28 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_105",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-06-20 10:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 127/77, pulse 71, wt 175 lb",
   "eGFR 73 (today)",
   "K 4.3 (today)",
   "A1c 7.9% (today)",
   "LDL 104 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2023-06-20 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_118",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2023-11-24 09:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 134/82, pulse 77, wt 178 lb",
   "eGFR 74 (today)",
   "K 4.4 (today)",
   "UACR 50 mg/g (today)",
   "A1c 8% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "dulaglutide: not started by 2023-11-24 (pattern /\\b(dulaglutide|Trulicity)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_136/0",
  "kind": "Medication event comment",
  "when": "2024-04-15 16:01",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "start dulaglutide 1.5 MG/0.5 ML Pen Injector 0.5 mg OTHER; reason: A1c 8.5"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.5)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_129",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-04-15 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "dulaglutide: started 0.5 mg weekly today (A1c 8.5)"
  ],
  "context": [
   "BP 140/82, repeat 135/79, pulse 69, wt 179 lb",
   "eGFR 70 (today)",
   "K 4.3 (today)",
   "A1c 8.5% (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_137",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2024-09-10 15:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/76, pulse 80, wt 177 lb",
   "eGFR 69 (today)",
   "K 4.8 (today)",
   "A1c 7.7% (today)",
   "LDL 80 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_147",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-02-10 08:10",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 126/74, pulse 67, wt 174 lb",
   "eGFR 71 (2/4)",
   "K 4.4 (2/4)",
   "UACR 47 mg/g (2/4)",
   "A1c 7.8% (2/4)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_158",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2025-08-06 09:45",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 132/77, pulse 83, wt 176 lb",
   "eGFR 67 (7/31)",
   "K 4.5 (7/31)",
   "UACR 51 mg/g (7/31)",
   "A1c 7.9% (7/31)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/med/m_7/1",
  "kind": "Medication event comment",
  "when": "2025-08-28 13:55",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "1-2 short lines",
  "refs": [
   {
    "id": "med_1",
    "about": "hold metformin hydrochloride 1000 MG Oral Tablet 1000 mg BID; reason: vomiting, poor oral intake"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "metformin: held today (vomiting, poor oral intake); review 2025-09-04"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_183",
  "kind": "Primary care phone visit note (reason: Phone: sick, vomiting)",
  "when": "2025-08-28 13:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [
   "metformin: held today (vomiting, poor oral intake); review 2025-09-04"
  ],
  "context": [],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_165",
  "kind": "Primary care office visit note (reason: Chronic care visit)",
  "when": "2025-12-04 14:50",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 128/73, pulse 88, wt 177 lb",
   "eGFR 71 (today)",
   "K 4.7 (today)",
   "UACR 61 mg/g (today)",
   "A1c 7.3% (today)",
   "LDL 69 mg/dL (today)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 },
 {
  "key": "B/visit/e_176",
  "kind": "Primary care office visit note (reason: Diabetes follow-up)",
  "when": "2026-06-02 08:40",
  "author": "Teresa Reyes, MD (Primary care physician)",
  "length": "3-7 short lines",
  "refs": [],
  "spans": [],
  "mustInclude": [],
  "context": [
   "BP 129/78, pulse 78, wt 172 lb",
   "eGFR 72 (5/27)",
   "K 4.5 (5/27)",
   "UACR 43 mg/g (5/27)",
   "A1c 7.6% (5/27)"
  ],
  "forbidden": [
   "c_5 is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_9 is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": []
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
