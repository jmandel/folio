---
folio: "0.1"
id: "01M0V89S2G10GQG7AZS4CFJZ1N"
issuer: "did:web:homelog.example"
patient: "HL-U-88924"
effective: "2026-08-23"
recorded: "2026-08-25T01:24:34Z"
author:
  id: "urn:homelog:user:HL-U-88924"
  name: "John Jackson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01M0SAS9VRCCFTGT72C570DMYK"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-23T07:29",
    "value": 141,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-23T07:39",
    "systolic_mmhg": 131,
    "diastolic_mmhg": 76,
    "entry_method": "typed"
  }
}
```
