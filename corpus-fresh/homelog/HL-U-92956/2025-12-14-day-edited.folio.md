---
folio: "0.1"
id: "01KCJCEJERG9CS2ZB7QJK9W26P"
issuer: "did:web:homelog.example"
patient: "HL-U-92956"
effective: "2025-12-14"
recorded: "2025-12-16T01:29:59Z"
author:
  id: "urn:homelog:user:HL-U-92956"
  name: "Evelyn Khan"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KCGD9XAGT0DJX2W19NQ40VD8"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-12-14T07:00",
    "value": 156,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-12-14T07:00",
    "systolic_mmhg": 133,
    "diastolic_mmhg": 82,
    "entry_method": "typed"
  }
}
```
