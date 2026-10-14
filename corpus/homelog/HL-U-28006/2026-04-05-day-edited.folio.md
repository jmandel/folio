---
folio: "0.1"
id: "01KNJSERD82YZHVNQB9TBJ3KJK"
issuer: "did:web:homelog.example"
patient: "HL-U-28006"
effective: "2026-04-05"
recorded: "2026-04-07T01:38:33Z"
author:
  id: "urn:homelog:user:HL-U-28006"
  name: "Dale Khan"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KNGQHXZRNY3PT3G0X4VZ79W3"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-04-05T07:00",
    "value": 106,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-04-05T07:06",
    "systolic_mmhg": 129,
    "diastolic_mmhg": 75,
    "entry_method": "typed"
  }
}
```
