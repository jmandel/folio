---
folio: "0.1"
id: "01M186980R9YW5AQYJK5CDJYPM"
issuer: "did:web:homelog.example"
patient: "HL-U-70272"
effective: "2026-08-28"
recorded: "2026-08-30T01:59:27Z"
author:
  id: "urn:homelog:user:HL-U-70272"
  name: "Priya Tran"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01M1637QRR1ETCH596BZKFB4BE"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-28T08:40",
    "value": 160,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-28T08:50",
    "systolic_mmhg": 126,
    "diastolic_mmhg": 78,
    "entry_method": "typed"
  }
}
```
