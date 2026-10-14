---
folio: "0.1"
id: "01JBK1YV20HTJ26YZXQFQAKCMZ"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2024-10-31"
recorded: "2024-11-01T05:07:52Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
**8:40 AM** — <ref id="note_1">Day 3 of this stomach bug. Threw up twice in the night. Can't keep food down, still taking my pills. Sugar only 171 so I don't think it's my diabetes.</ref>

**6:15 PM** — <ref id="note_2">Had a few crackers and some ginger ale, that's all today. So tired. Breathing feels heavy when I lay down.</ref>

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-10-31T08:22",
    "value": 171,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "note_1": {
    "type": "diary_note",
    "written_at": "2024-10-31T08:40",
    "symptom_tags": ["nausea", "vomiting", "poor_appetite"],
    "severity": 4
  },
  "note_2": {
    "type": "diary_note",
    "written_at": "2024-10-31T18:15",
    "symptom_tags": ["poor_appetite", "tired", "short_of_breath"],
    "severity": 4
  }
}
```
