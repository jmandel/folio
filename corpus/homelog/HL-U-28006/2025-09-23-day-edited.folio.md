---
folio: "0.1"
id: "01K5Z857385MTRNAJ1PM4XWB5M"
issuer: "did:web:homelog.example"
patient: "HL-U-28006"
effective: "2025-09-23"
recorded: "2025-09-25T01:35:13Z"
author:
  id: "urn:homelog:user:HL-U-28006"
  name: "Dale Khan"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K5X1ZFT8NK4P0RGWKAAKZ8D3"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-09-23T07:00",
    "value": 136,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-09-23T07:07",
    "systolic_mmhg": 129,
    "diastolic_mmhg": 78,
    "entry_method": "typed"
  }
}
```
