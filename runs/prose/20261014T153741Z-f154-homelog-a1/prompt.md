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

## Requests (3)

```json
[
 {
  "key": "P/day/2023-03-27/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2023-03-27",
  "author": "Harold Williams (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 6:21 PM; tags: nausea, poor_appetite"
   }
  ],
  "spans": [],
  "mustInclude": [
   "note_1 must convey, in her words: Flu, fever 102, no appetite at all. Just tea and crackers."
  ],
  "context": [],
  "forbidden": [
   "chlorthalidone: not started by 2023-03-27 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**6:21 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Flu, fever 102, no appetite at all. Just tea and crackers."
  ]
 },
 {
  "key": "P/day/2023-04-06/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2023-04-06",
  "author": "Harold Williams (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 10:36 AM; tags: tired"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [],
  "forbidden": [
   "chlorthalidone: not started by 2023-04-06 (pattern /\\b(chlorthalidone)\\b/i)"
  ],
  "sensitive": [],
  "skeleton": "**10:36 AM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Home from Riverside. They said my diabetes pill caused the acid problem and not to take it until my doctor sees me."
  ]
 },
 {
  "key": "P/day/2024-05-16/0",
  "kind": "Diary notes typed by the patient into her phone app",
  "when": "2024-05-16",
  "author": "Harold Williams (the patient)",
  "length": "1-3 sentences per note, in her own voice",
  "refs": [
   {
    "id": "note_1",
    "about": "note written 7:36 PM; tags: none"
   }
  ],
  "spans": [],
  "mustInclude": [],
  "context": [],
  "forbidden": [],
  "sensitive": [],
  "skeleton": "**7:36 PM** — <ref id=\"note_1\">[words]</ref>",
  "gist": [
   "note_1: Changed the meter setting so it shows numbers like the clinic's (it was showing the small numbers before)."
  ]
 }
]
```

---
Write all output files under ./out/ (relative to your working directory). Do not modify ./in/.
