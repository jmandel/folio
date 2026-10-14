---
folio: "0.1"
id: "01KR7R0K4RP8YT6GAJK9X9J6YX"
issuer: "did:web:homelog.example"
patient: "HL-U-70868"
effective: "2026-05-08"
recorded: "2026-05-10T01:28:47Z"
author:
  id: "urn:homelog:user:HL-U-70868"
  name: "Evelyn Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KR5RYD3RPQV90T53BNENHBMR"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-05-08T07:38",
    "value": 167,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-05-08T07:48",
    "systolic_mmhg": 123,
    "diastolic_mmhg": 75,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2026-05-08T21:14",
    "homelog_med_id": "med_6",
    "med_name": "Insulin glargine",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
