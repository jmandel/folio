---
folio: "0.1"
id: "01KB95FDHRBJ8BJAHXKRX6VR9P"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2025-11-28"
recorded: "2025-11-30T01:19:15Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KB78W8T8A8YBZ61KM8GDRAES"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-11-28T07:02",
    "value": 175,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-11-28T07:12",
    "systolic_mmhg": 123,
    "diastolic_mmhg": 76,
    "entry_method": "typed"
  }
}
```
