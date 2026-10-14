---
folio: "0.1"
id: "01KZ56RR20K8WPPZSGDZDA1102"
issuer: "did:web:homelog.example"
patient: "HL-U-71697"
effective: "2026-08-02"
recorded: "2026-08-04T01:38:48Z"
author:
  id: "urn:homelog:user:HL-U-71697"
  name: "Tyrone Lewis"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KZ37FS7G96402Q6DAKCW7REE"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-02T08:06",
    "value": 158,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-02T08:16",
    "systolic_mmhg": 136,
    "diastolic_mmhg": 80,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2026-08-02T21:38",
    "homelog_med_id": "med_5",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
