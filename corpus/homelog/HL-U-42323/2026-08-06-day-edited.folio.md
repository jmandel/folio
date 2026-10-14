---
folio: "0.1"
id: "01KZFF0QZRCT67A6YGSYCKQ4X7"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2026-08-06"
recorded: "2026-08-08T01:15:23Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KZDH8WEGK3MB4NWXJ2QYRP3P"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-06T06:00",
    "value": 154,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-06T06:00",
    "systolic_mmhg": 119,
    "diastolic_mmhg": 65,
    "entry_method": "typed"
  }
}
```
