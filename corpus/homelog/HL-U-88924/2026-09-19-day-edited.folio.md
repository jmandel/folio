---
folio: "0.1"
id: "01M30SNFFRKX1YXBBPZB3PYE33"
issuer: "did:web:homelog.example"
patient: "HL-U-88924"
effective: "2026-09-19"
recorded: "2026-09-21T01:35:39Z"
author:
  id: "urn:homelog:user:HL-U-88924"
  name: "John Jackson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01M2YVSF4GDNACSNCD0094QVW4"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-09-19T06:00",
    "value": 173,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-09-19T06:01",
    "systolic_mmhg": 136,
    "diastolic_mmhg": 79,
    "entry_method": "typed"
  }
}
```
