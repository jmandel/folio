---
folio: "0.1"
id: "01KNNC2XP89B03ZM9FD44EEBZR"
issuer: "did:web:homelog.example"
patient: "HL-U-70302"
effective: "2026-04-06"
recorded: "2026-04-08T01:42:37Z"
author:
  id: "urn:homelog:user:HL-U-70302"
  name: "Tuan Nelson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KNK8E66R0E9JW7K6XFP56CSQ"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-04-06T08:21",
    "value": 154,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-04-06T08:31",
    "systolic_mmhg": 142,
    "diastolic_mmhg": 79,
    "entry_method": "typed"
  }
}
```
