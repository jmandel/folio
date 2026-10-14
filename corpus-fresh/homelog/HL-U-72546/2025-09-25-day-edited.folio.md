---
folio: "0.1"
id: "01K64CT7G0X190KHT3YM30N6ZA"
issuer: "did:web:homelog.example"
patient: "HL-U-72546"
effective: "2025-09-25"
recorded: "2025-09-27T01:32:48Z"
author:
  id: "urn:homelog:user:HL-U-72546"
  name: "Lois Wilson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K628S7E0XNBVPHCWAZEDRDAK"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-09-25T07:04",
    "value": 154,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-09-25T07:14",
    "systolic_mmhg": 122,
    "diastolic_mmhg": 72,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2025-09-25T21:42",
    "homelog_med_id": "med_4",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 18,
    "amount_unit": "units"
  }
}
```
