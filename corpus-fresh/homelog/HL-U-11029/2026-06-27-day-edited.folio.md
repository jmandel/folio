---
folio: "0.1"
id: "01KW8GT6BRGJHMCHW9CA81Z14V"
issuer: "did:web:homelog.example"
patient: "HL-U-11029"
effective: "2026-06-27"
recorded: "2026-06-29T01:44:59Z"
author:
  id: "urn:homelog:user:HL-U-11029"
  name: "Ida Patel"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KW6D5WHRFYW9C7JHZ63J5XJZ"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-06-27T07:28",
    "value": 135,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-06-27T07:38",
    "systolic_mmhg": 144,
    "diastolic_mmhg": 88,
    "entry_method": "typed"
  }
}
```
