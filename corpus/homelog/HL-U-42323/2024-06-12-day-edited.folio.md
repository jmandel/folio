---
folio: "0.1"
id: "01J0A72V20W2J8HE3PX4V74YPV"
issuer: "did:web:homelog.example"
patient: "HL-U-42323"
effective: "2024-06-12"
recorded: "2024-06-14T01:51:36Z"
author:
  id: "urn:homelog:user:HL-U-42323"
  name: "Anjali Perez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01J084JZ8GSDGW0ZV48KEE928G"
---

```json payload
{
  "glu_1": {
    "type": "glucose_reading",
    "measured_at": "2024-06-12T07:08",
    "value": 8.2,
    "unit": "mmol/L",
    "meal_marker": "fasting",
    "entry_method": "meter_sync"
  },
  "bp_1": {
    "type": "bp_reading",
    "measured_at": "2024-06-12T07:18",
    "systolic_mmhg": 137,
    "diastolic_mmhg": 77,
    "entry_method": "typed"
  }
}
```
