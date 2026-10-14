# Task

You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from HomeLog (the patient's own phone diary). Its structured data already exists; you write only the human-readable note text that goes with it.

## How this source writes

The patient types short diary notes into a phone app. First person, plain everyday words, sometimes run-on sentences or small typos; no medical jargon unless a clinician said it to them; brand names or nicknames for medicines ('my water pill', 'Jardiance').
The app adds the bold time label; the patient's words go inside the span. Follow the skeleton exactly.

## Reference notes from this source (other dates; for style only, do not copy their facts)

```markdown
**8:40 AM** — <ref id="note_1">Day 3 of this stomach bug. Threw up twice in the night. Can't keep food down, still taking my pills. Sugar only 171 so I don't think it's my diabetes.</ref>

**6:15 PM** — <ref id="note_2">Had a few crackers and some ginger ale, that's all today. So tired. Breathing feels heavy when I lay down.</ref>
```

```markdown
**3:30 PM** — <ref id="note_1">Marcus changed the meter so it shows the numbers the same way the clinic does. Morning one was still the old way.</ref>
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

## Requests (6)

```json
[
 {
  "key": "P/day/2024-10-29/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2024-10-29",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 8:10 PM; tags: nausea, vomiting, diarrhea"
   }
  ],
  "spans": [],
  "mustInclude": [
   "note_1 must convey, in her words: Stomach bug started today; threw up after lunch, loose stools; a coworker had the same thing."
  ],
  "context": [
   "reading that day: BP 141/88, HR 68 at 2024-10-29 08:32",
   "reading that day: glucose 181 mg/dL at 2024-10-29 08:14"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-29 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-10-29 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-10-29 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**8:10 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Stomach bug started today; threw up after lunch, loose stools; a coworker had the same thing."
  ]
 },
 {
  "key": "P/day/2024-10-30/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2024-10-30",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 7:05 PM; tags: nausea, poor_appetite"
   }
  ],
  "spans": [],
  "mustInclude": [
   "note_1 must convey, in her words: Still can't eat much, only sips of water and broth; took her morning pills anyway.",
   "note_1 must convey, in her words: Still can't eat much, only sips of water and broth; took her morning pills anyway."
  ],
  "context": [],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "insulin glargine: not started by 2024-10-30 (pattern /\\b(glargine|Lantus)\\b/i)",
   "finerenone: not started by 2024-10-30 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-10-30 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**7:05 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Still can't eat much, only sips of water and broth; took her morning pills anyway."
  ]
 },
 {
  "key": "P/day/2024-11-07/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2024-11-07",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 10:30 AM; tags: none"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "empagliflozin 10 mg daily, held"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2024-11-07 (pattern /\\b(finerenone|Kerendia)\\b/i)",
   "ibuprofen: not started by 2024-11-07 (pattern /\\b(ibuprofen|Advil|NSAID)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**10:30 AM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Home from Riverside since Tuesday. They said the Jardiance caused the acid problem; not to take it until Dr Reyes sees me."
  ]
 },
 {
  "key": "P/day/2025-10-14/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2025-10-14",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 9:20 PM; tags: none"
   }
  ],
  "spans": [],
  "mustInclude": [
   "note_1 must convey, in her words: Sugars running over 200 some days; she has started taking 12 units of Lantus on those nights instead of 10, her own rule."
  ],
  "context": [
   "reading that day: BP 141/77, HR 77 at 2025-10-14 07:07",
   "reading that day: glucose 180 mg/dL at 2025-10-14 07:00"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2025-10-14 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**9:20 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Sugars running over 200 some days; she has started taking 12 units of Lantus on those nights instead of 10, her own rule."
  ]
 },
 {
  "key": "P/day/2026-03-28/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2026-03-28",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 4:45 PM; tags: pain"
   }
  ],
  "spans": [],
  "mustInclude": [
   "note_1 must convey, in her words: Knee acting up after gardening; took 2 Advil like she does maybe twice a week; updated her medicine list."
  ],
  "context": [
   "reading that day: BP 132/84, HR 70 at 2026-03-28 08:41",
   "reading that day: glucose 177 mg/dL at 2026-03-28 08:33"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)",
   "finerenone: not started by 2026-03-28 (pattern /\\b(finerenone|Kerendia)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**4:45 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Knee acting up after gardening; took 2 Advil like she does maybe twice a week; updated her medicine list."
  ]
 },
 {
  "key": "P/day/2026-09-15/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2026-09-15",
  "author": "Linda Okafor (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 8:05 AM; tags: none"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [
   "finerenone 10 mg daily, held (K 5.8 / 5.7 confirmed)",
   "reading that day: BP 141/90, HR 72 at 2026-09-15 06:05",
   "reading that day: glucose 176 mg/dL at 2026-09-15 06:00"
  ],
  "forbidden": [
   "c_mdd is sensitive and has no span of its own in this note (pattern /depress|\\bMDD\\b|F33/i)",
   "m_sertraline is sensitive and has no span of its own in this note (pattern /\\b(sertraline|Zoloft)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**8:05 AM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Dr Marsh called: potassium high, stop the new kidney pill (Kerendia) for now, eat fewer bananas, lab in 2 weeks."
  ]
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
