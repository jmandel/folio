---
folio: "0.1"
id: "01KMS1W5QG56YEWCAXZ62JNQ7Q"
issuer: "did:web:homelog.example"
patient: "HL-U-57105"
effective: "2026-03-26"
recorded: "2026-03-28T01:45:26Z"
author:
  id: "urn:homelog:user:HL-U-57105"
  name: "Curtis Parker"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KMPVS2E09C40SGYYWVY97N75"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-03-26T07:16",
    "value": 172,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-03-26T07:26",
    "systolic_mmhg": 134,
    "diastolic_mmhg": 82,
    "entry_method": "typed"
  }
}
```
