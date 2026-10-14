---
folio: "0.1"
id: "01K913DYXRG0WZE0JDT8V9RTR8"
issuer: "did:web:homelog.example"
patient: "HL-U-70302"
effective: "2025-10-31"
recorded: "2025-11-02T01:38:11Z"
author:
  id: "urn:homelog:user:HL-U-70302"
  name: "Tuan Nelson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K8Z2YEPG59M1YK59SMKQRAJJ"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-10-31T07:00",
    "value": 98,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-10-31T07:03",
    "systolic_mmhg": 144,
    "diastolic_mmhg": 86,
    "entry_method": "typed"
  }
}
```
