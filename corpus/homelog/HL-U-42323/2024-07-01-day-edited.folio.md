---
folio: "0.1"
id: "01J1V34A28GEB2V2KYGK7S0RRF"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-07-01"
recorded: "2024-07-03T01:25:17Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01J1RZN4A8R7C9VT3Q3BFZWHEY"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-07-01T06:42",
    "value": 9.5,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-07-01T06:52",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 80,
    "entry_method": "typed"
  }
}
```
