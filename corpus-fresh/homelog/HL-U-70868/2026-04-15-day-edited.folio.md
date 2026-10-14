---
folio: "0.1"
id: "01KPCG5Z3RE34WPGBKNDCZ8WWD"
issuer: "did:web:homelog.example"
patient: "HL-U-70868"
effective: "2026-04-15"
recorded: "2026-04-17T01:16:43Z"
author:
  id: "urn:homelog:user:HL-U-70868"
  name: "Evelyn Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KPAKVGPGT8RDZY10S9HFQ86D"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-04-15T08:21",
    "value": 191,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-04-15T08:31",
    "systolic_mmhg": 133,
    "diastolic_mmhg": 77,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2026-04-15T21:49",
    "homelog_med_id": "med_6",
    "med_name": "Insulin glargine",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
