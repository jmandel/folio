---
folio: "0.1"
id: "01KC834MK0S95S7X7PRRRYFFRP"
issuer: "did:web:homelog.example"
patient: "HL-U-83071"
effective: "2025-12-10"
recorded: "2025-12-12T01:34:52Z"
author:
  id: "urn:homelog:user:HL-U-83071"
  name: "Ida Liu"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KC63J52G6DT1MSM5VMD6NW49"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-12-10T06:16",
    "value": 159,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-12-10T06:26",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 86,
    "entry_method": "typed"
  }
}
```
