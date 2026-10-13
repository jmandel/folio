---
folio: "0.1"
id: "01HPBCMY306186DWSVE0HPFEHK"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2024-02-10"
recorded: "2024-02-11T06:11:08Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
**3:30 PM** — <ref id="note_1">Marcus changed the meter so it shows the numbers the same way the clinic does. Morning one was still the old way.</ref>

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-02-10T07:51",
    "value": 8.1,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "glu_2": {
    "type": "glucose_reading",
    "measured_at": "2024-02-10T19:42",
    "value": 162,
    "unit": "mg/dL",
    "meal_marker": "after_meal",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-02-10T08:04",
    "systolic_mmhg": 136,
    "diastolic_mmhg": 82,
    "pulse_bpm": 70,
    "entry_method": "cuff_sync",
    "arm": "left"
  },
  "note_1": {
    "type": "diary_note",
    "written_at": "2024-02-10T15:30",
    "symptom_tags": []
  }
}
```
