---
folio: "0.1"
id: "01KNQ3AJ4RW2ZFW247JCEATMJ8"
issuer: "did:web:homelog.example"
patient: "HL-U-63555"
effective: "2026-04-08"
recorded: "2026-04-08T17:47:59Z"
author:
  id: "urn:homelog:user:HL-U-63555"
  name: "Mary Ali"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 8 April 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "197884", "display": "lisinopril 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Zoloft",
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
