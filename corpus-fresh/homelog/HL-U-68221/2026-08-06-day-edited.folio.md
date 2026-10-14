---
folio: "0.1"
id: "01KZFH4EZGWGM5MMD2J5F0VW9A"
issuer: "did:web:homelog.example"
patient: "HL-U-68221"
effective: "2026-08-06"
recorded: "2026-08-08T01:52:22Z"
author:
  id: "urn:homelog:user:HL-U-68221"
  name: "Rajesh Stewart"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KZDGRNWR40EV7MFTARCZFCX1"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-06T08:25",
    "value": 166,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-06T08:35",
    "systolic_mmhg": 117,
    "diastolic_mmhg": 68,
    "entry_method": "typed"
  }
}
```
