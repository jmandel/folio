---
folio: "0.1"
id: "01KNTFQTR001597780H234TN5W"
issuer: "did:web:homelog.example"
patient: "HL-U-81813"
effective: "2026-04-08"
recorded: "2026-04-10T01:22:40Z"
author:
  id: "urn:homelog:user:HL-U-81813"
  name: "Amina Murray"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KNRFNFDGMX2ER6GFDY9CKEBD"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-04-08T06:20",
    "value": 158,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-04-08T06:30",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 86,
    "entry_method": "typed"
  }
}
```
