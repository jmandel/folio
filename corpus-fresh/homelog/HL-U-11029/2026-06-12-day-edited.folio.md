---
folio: "0.1"
id: "01KV1X1TE8X246HZKSY06SSF87"
issuer: "did:web:homelog.example"
patient: "HL-U-11029"
effective: "2026-06-12"
recorded: "2026-06-14T01:48:29Z"
author:
  id: "urn:homelog:user:HL-U-11029"
  name: "Ida Patel"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KTZP2PN8KD7TRJ1KZBBVZTT7"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-06-12T06:15",
    "value": 104,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-06-12T06:25",
    "systolic_mmhg": 141,
    "diastolic_mmhg": 88,
    "entry_method": "typed"
  }
}
```
