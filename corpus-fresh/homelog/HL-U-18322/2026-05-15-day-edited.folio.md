---
folio: "0.1"
id: "01KRSTAGK8W5KB952GDK5AQ4EY"
issuer: "did:web:homelog.example"
patient: "HL-U-18322"
effective: "2026-05-15"
recorded: "2026-05-17T01:55:29Z"
author:
  id: "urn:homelog:user:HL-U-18322"
  name: "Hiroshi Nguyen"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KRQNS810X9K1XQ2YHA3V37PT"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-05-15T07:18",
    "value": 137,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-05-15T07:28",
    "systolic_mmhg": 144,
    "diastolic_mmhg": 91,
    "entry_method": "typed"
  }
}
```
