---
folio: "0.1"
id: "01K354MY6RER4J9VD6EYDPZ5KA"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2025-08-19"
recorded: "2025-08-21T01:42:15Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K32Y3SP83XC8N4W8T61981JQ"
---
**9:50 PM** — <ref id="note_1">Second night of the Lantus. The pen is easier than I thought.</ref>

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-08-19T07:06",
    "value": 212,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-08-19T12:30",
    "systolic_mmhg": 148,
    "diastolic_mmhg": 88,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2025-08-19T21:45",
    "homelog_med_id": "med_6",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  },
  "note_1": {
    "type": "diary_note",
    "written_at": "2025-08-19T21:50",
    "symptom_tags": []
  }
}
```
