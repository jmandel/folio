---
folio: "0.1"
id: "01KAQ60C9RSZX6JNKA3MFQ5VC9"
issuer: "did:web:homelog.example"
patient: "HL-U-41558"
effective: "2025-11-21"
recorded: "2025-11-23T01:42:11Z"
author:
  id: "urn:homelog:user:HL-U-41558"
  name: "Raymond Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KAN81E6GATGEJRF9TVB92X1W"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2025-11-21T06:03",
    "value": 101,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2025-11-21T06:13",
    "systolic_mmhg": 154,
    "diastolic_mmhg": 92,
    "entry_method": "typed"
  }
}
```
