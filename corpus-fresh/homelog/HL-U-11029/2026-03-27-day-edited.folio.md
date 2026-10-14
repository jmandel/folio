---
folio: "0.1"
id: "01KMVJV1Y0HJ5319JV2K6HC9KJ"
issuer: "did:web:homelog.example"
patient: "HL-U-11029"
effective: "2026-03-27"
recorded: "2026-03-29T01:20:24Z"
author:
  id: "urn:homelog:user:HL-U-11029"
  name: "Ida Patel"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KMSF9D2RTVVHET36VD3JXGAA"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-03-27T08:40",
    "value": 147,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-03-27T08:50",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 82,
    "entry_method": "typed"
  }
}
```
