---
folio: "0.1"
id: "01J3KRTMM8S1G6GYWDJ14KT6J6"
issuer: "did:web:homelog.example"
patient: "HL-U-67645"
effective: "2024-07-23"
recorded: "2024-07-25T01:41:57Z"
author:
  id: "urn:homelog:user:HL-U-67645"
  name: "Janet Sanchez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01J3HKVER0RES1PMRN1DETD1Q4"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-07-23T06:00",
    "value": 159,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-07-23T06:08",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 86,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2024-07-23T21:28",
    "homelog_med_id": "med_4",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
