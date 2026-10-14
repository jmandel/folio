---
folio: "0.1"
id: "01KM4EMK4GZ4MMSG598GTS4MYX"
issuer: "did:web:homelog.example"
patient: "HL-U-72546"
effective: "2026-03-18"
recorded: "2026-03-20T01:44:26Z"
author:
  id: "urn:homelog:user:HL-U-72546"
  name: "Lois Wilson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KM28EA901RWDRW07BDHXXZXH"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-03-18T06:39",
    "value": 141,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-03-18T06:49",
    "systolic_mmhg": 128,
    "diastolic_mmhg": 72,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2026-03-18T21:27",
    "homelog_med_id": "med_4",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 18,
    "amount_unit": "units"
  }
}
```
