---
folio: "0.1"
id: "01HR8NAW90HXP27CS0RP1MYJ6X"
issuer: "did:web:homelog.example"
patient: "HL-U-12862"
effective: "2024-03-04"
recorded: "2024-03-06T01:16:36Z"
author:
  id: "urn:homelog:user:HL-U-12862"
  name: "Ruth Kerrigan"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HR6G8MQRDSHG181DQ8T1VTQD"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-03-04T07:00",
    "value": 170,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-03-04T07:05",
    "systolic_mmhg": 141,
    "diastolic_mmhg": 91,
    "entry_method": "typed"
  }
}
```
