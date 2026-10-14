---
folio: "0.1"
id: "01HTGTD9E811VJ2J0572ME0JY4"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-04-01"
recorded: "2024-04-03T01:50:37Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HTEVWTSGSKNJFCMWQQKKPMB3"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-04-01T08:00",
    "value": 10.7,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-04-01T08:08",
    "systolic_mmhg": 135,
    "diastolic_mmhg": 79,
    "entry_method": "typed"
  }
}
```
