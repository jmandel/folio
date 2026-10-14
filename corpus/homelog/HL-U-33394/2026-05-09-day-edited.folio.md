---
folio: "0.1"
id: "01KRAAPD58AK8EQ8A59DXPKZ31"
issuer: "did:web:homelog.example"
patient: "HL-U-33394"
effective: "2026-05-09"
recorded: "2026-05-11T01:33:45Z"
author:
  id: "urn:homelog:user:HL-U-33394"
  name: "Gloria Phillips"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KR8935C8EVJ0P0GVZVEF912S"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2026-05-09T06:05",
    "value": 146,
    "unit": "mg/dL",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2026-05-09T06:15",
    "systolic_mmhg": 139,
    "diastolic_mmhg": 87,
    "entry_method": "typed"
  }
}
```
