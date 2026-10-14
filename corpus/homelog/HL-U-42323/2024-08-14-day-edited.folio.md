---
folio: "0.1"
id: "01J5CCBGH89SZGDBEVYSPN1WW1"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-08-14"
recorded: "2024-08-16T01:20:41Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01J5A7GW58M3Z1DRN5H099BRRK"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-08-14T07:44",
    "value": 9.3,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-08-14T07:54",
    "systolic_mmhg": 130,
    "diastolic_mmhg": 80,
    "entry_method": "typed"
  }
}
```
