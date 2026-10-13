---
folio: "0.1"
id: "01GXT102J8HAJNV6TGVJ03EWFR"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2023-04-11"
recorded: "2023-04-12T06:03:41Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
**7:15 AM** — <ref id="note_1">First day using the new cuff and the meter app together. Dr said check BP twice a week and sugar in the mornings.</ref>

```json payload
{
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2023-04-11T07:02",
    "systolic_mmhg": 142,
    "diastolic_mmhg": 86,
    "pulse_bpm": 74,
    "entry_method": "cuff_sync",
    "arm": "left"
  },
  "bp_2": {
    "type": "bp_reading",
    "measured_at": "2023-04-11T07:05",
    "systolic_mmhg": 138,
    "diastolic_mmhg": 84,
    "pulse_bpm": 72,
    "entry_method": "cuff_sync",
    "arm": "left"
  },
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2023-04-11T06:48",
    "value": 7.8,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "note_1": {
    "type": "diary_note",
    "written_at": "2023-04-11T07:15",
    "symptom_tags": []
  }
}
```
