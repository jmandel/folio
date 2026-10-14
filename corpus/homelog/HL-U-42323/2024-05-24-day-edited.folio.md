---
folio: "0.1"
id: "01HYS7Y2A8HRHS553MWE9GQQ1Z"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-05-24"
recorded: "2024-05-26T01:23:41Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HYQ5HVPRYSKEHNM41PPDC4S8"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-05-24T08:03",
    "value": 7.9,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-05-24T08:13",
    "systolic_mmhg": 132,
    "diastolic_mmhg": 85,
    "entry_method": "typed"
  }
}
```
