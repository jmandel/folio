---
folio: "0.1"
id: "01KSV86K98PFPGP63WD3TPH0ZY"
issuer: "did:web:homelog.example"
patient: "HL-U-46871"
effective: "2026-05-28"
recorded: "2026-05-30T01:32:57Z"
author:
  id: "urn:homelog:user:HL-U-46871"
  name: "Samuel Sanchez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KSS3FVX8Y0ZAQ3ZFKZ13NVR3"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-05-28T07:15",
    "value": 155,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-05-28T07:25",
    "systolic_mmhg": 138,
    "diastolic_mmhg": 79,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2026-05-28T21:16",
    "homelog_med_id": "med_6",
    "med_name": "Insulin glargine",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
