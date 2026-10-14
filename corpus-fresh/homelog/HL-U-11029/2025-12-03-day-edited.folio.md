---
folio: "0.1"
id: "01KBP3FNWGBHYHGDR40FEQYXSJ"
issuer: "did:web:homelog.example"
patient: "HL-U-11029"
effective: "2025-12-03"
recorded: "2025-12-05T01:54:34Z"
author:
  id: "urn:homelog:user:HL-U-11029"
  name: "Ida Patel"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KBM1EVH8KQN79ZQFAJEGJKMB"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-12-03T06:37",
    "value": 153,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-12-03T06:47",
    "systolic_mmhg": 142,
    "diastolic_mmhg": 90,
    "entry_method": "typed"
  }
}
```
