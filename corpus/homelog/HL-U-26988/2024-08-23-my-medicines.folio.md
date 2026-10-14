---
folio: "0.1"
id: "01J60PFJ10AFQ130B256FPZXXD"
issuer: "did:web:homelog.example"
patient: "HL-U-26988"
effective: "2024-08-23"
recorded: "2024-08-23T22:42:28Z"
author:
  id: "urn:homelog:user:HL-U-26988"
  name: "Frank Ali"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HW5ZB788MVY213J116E2KZJX"
---
My Medicines, saved 23 August 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Glucophage",
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Lantus",
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
