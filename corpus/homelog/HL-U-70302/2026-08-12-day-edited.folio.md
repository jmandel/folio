---
folio: "0.1"
id: "01KZYX4FJGEPQG16ZPQYQGVQFW"
issuer: "did:web:homelog.example"
patient: "HL-U-70302"
effective: "2026-08-12"
recorded: "2026-08-14T01:10:42Z"
author:
  id: "urn:homelog:user:HL-U-70302"
  name: "Tuan Nelson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KZWXR2CRWCVN7XP16JQFQMEY"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-08-12T06:39",
    "value": 181,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-08-12T06:49",
    "systolic_mmhg": 136,
    "diastolic_mmhg": 82,
    "entry_method": "typed"
  }
}
```
