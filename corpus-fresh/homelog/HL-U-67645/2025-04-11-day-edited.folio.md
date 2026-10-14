---
folio: "0.1"
id: "01JRPBEYG0E2S2VD1NV55HETV6"
issuer: "did:web:homelog.example"
patient: "HL-U-67645"
effective: "2025-04-11"
recorded: "2025-04-13T01:15:44Z"
author:
  id: "urn:homelog:user:HL-U-67645"
  name: "Janet Sanchez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01JRMBMTV0WCVA21HSHCJP82Z4"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-04-11T06:36",
    "value": 167,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-04-11T06:46",
    "systolic_mmhg": 149,
    "diastolic_mmhg": 87,
    "entry_method": "typed"
  },
  "dose_1": {
    "type": "dose_log",
    "at": "2025-04-11T21:49",
    "homelog_med_id": "med_4",
    "med_name": "Lantus",
    "status": "taken",
    "amount": 10,
    "amount_unit": "units"
  }
}
```
