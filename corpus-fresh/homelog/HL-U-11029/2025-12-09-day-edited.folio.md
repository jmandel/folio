---
folio: "0.1"
id: "01KC5J4K90VNTHDEBDRTHAXD96"
issuer: "did:web:homelog.example"
patient: "HL-U-11029"
effective: "2025-12-09"
recorded: "2025-12-11T01:59:16Z"
author:
  id: "urn:homelog:user:HL-U-11029"
  name: "Ida Patel"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KC3KTPK04B2WRJ044Q0NXWNW"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-12-09T06:20",
    "value": 135,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-12-09T06:30",
    "systolic_mmhg": 142,
    "diastolic_mmhg": 80,
    "entry_method": "typed"
  }
}
```
