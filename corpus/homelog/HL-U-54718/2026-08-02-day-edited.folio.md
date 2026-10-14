---
folio: "0.1"
id: "01KZ55D3JGX59G8ZG46ZFFYXA0"
issuer: "did:web:homelog.example"
patient: "HL-U-54718"
effective: "2026-08-02"
recorded: "2026-08-04T01:14:58Z"
author:
  id: "urn:homelog:user:HL-U-54718"
  name: "Bernice King"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KZ39FBD895NP2FJYZFXA1BGQ"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-02T08:39",
    "value": 122,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-02T08:49",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 85,
    "entry_method": "typed"
  }
}
```
