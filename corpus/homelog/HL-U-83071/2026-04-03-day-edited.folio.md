---
folio: "0.1"
id: "01KNDKK4N8J2PGC0HWQV1ZY0MA"
issuer: "did:web:homelog.example"
patient: "HL-U-83071"
effective: "2026-04-03"
recorded: "2026-04-05T01:19:53Z"
author:
  id: "urn:homelog:user:HL-U-83071"
  name: "Ida Liu"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KNBHKGCRQE3RN159A3JKK15G"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-04-03T06:44",
    "value": 156,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-04-03T06:54",
    "systolic_mmhg": 151,
    "diastolic_mmhg": 89,
    "entry_method": "typed"
  }
}
```
