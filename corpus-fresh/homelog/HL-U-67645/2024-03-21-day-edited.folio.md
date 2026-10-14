---
folio: "0.1"
id: "01HSMF5EWGSS62AMN1BNGQ8FJZ"
issuer: "did:web:homelog.example"
patient: "HL-U-67645"
effective: "2024-03-21"
recorded: "2024-03-23T01:35:22Z"
author:
  id: "urn:homelog:user:HL-U-67645"
  name: "Janet Sanchez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HSJ9ZP28E9V7D70AGBHZ5RWQ"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-03-21T06:23",
    "value": 9.7,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-03-21T06:33",
    "systolic_mmhg": 138,
    "diastolic_mmhg": 86,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2024-03-21T21:13",
    "homelog_med_id": "med_4",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
