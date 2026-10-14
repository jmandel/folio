---
folio: "0.1"
id: "01JBN7WFHRX7VCRA469K96MQ6F"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-10-31"
recorded: "2024-11-02T01:29:55Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01JBK3NNY8WJXM14Z0VCQYA3GG"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-10-31T07:32",
    "value": 8.8,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-10-31T07:42",
    "systolic_mmhg": 150,
    "diastolic_mmhg": 91,
    "entry_method": "typed"
  }
}
```
