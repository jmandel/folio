---
folio: "0.1"
id: "01M3DPGFE89KCN6BTNB9C8SEB0"
issuer: "did:web:homelog.example"
patient: "HL-U-88924"
effective: "2026-09-24"
recorded: "2026-09-26T01:50:37Z"
author:
  id: "urn:homelog:user:HL-U-88924"
  name: "John Jackson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01M3BPK85RQQJAXMDG4N0ZP9MG"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-09-24T08:26",
    "value": 188,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-09-24T08:36",
    "systolic_mmhg": 123,
    "diastolic_mmhg": 75,
    "entry_method": "typed"
  }
}
```
