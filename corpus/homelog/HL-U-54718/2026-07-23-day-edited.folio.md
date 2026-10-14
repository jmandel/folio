---
folio: "0.1"
id: "01KYBFKVVGDQ7Y9FAV92Z0NWNS"
issuer: "did:web:homelog.example"
patient: "HL-U-54718"
effective: "2026-07-23"
recorded: "2026-07-25T01:53:10Z"
author:
  id: "urn:homelog:user:HL-U-54718"
  name: "Bernice King"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KY9AZZ9RDWP36NEYA9GWMY22"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-07-23T07:25",
    "value": 163,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-07-23T07:35",
    "systolic_mmhg": 158,
    "diastolic_mmhg": 91,
    "entry_method": "typed"
  }
}
```
