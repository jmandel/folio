---
folio: "0.1"
id: "01KG39GHV815V0G66QNJNNSGBC"
issuer: "did:web:homelog.example"
patient: "HL-U-46516"
effective: "2026-01-28"
recorded: "2026-01-28T21:52:49Z"
author:
  id: "urn:homelog:user:HL-U-46516"
  name: "Raymond Wang"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 28 January 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Zestril",
    "picked_from_search": { "rxnorm": "314077", "display": "lisinopril 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Lipitor",
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Zoloft",
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
