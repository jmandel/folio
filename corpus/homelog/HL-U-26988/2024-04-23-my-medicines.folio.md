---
folio: "0.1"
id: "01HW5ZB788MVY213J116E2KZJX"
issuer: "did:web:homelog.example"
patient: "HL-U-26988"
effective: "2024-04-23"
recorded: "2024-04-23T17:16:37Z"
author:
  id: "urn:homelog:user:HL-U-26988"
  name: "Frank Ali"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 23 April 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  }
}
```
