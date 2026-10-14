---
folio: "0.1"
id: "01HM1XM3WRKNK44A2RBAMNEZ6H"
issuer: "did:web:homelog.example"
patient: "HL-U-43370"
effective: "2024-01-13"
recorded: "2024-01-13T17:23:59Z"
author:
  id: "urn:homelog:user:HL-U-43370"
  name: "Curtis Freeman"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 13 January 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Zestril",
    "strength_text": "20 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Norvasc",
    "picked_from_search": { "rxnorm": "197361", "display": "amlodipine 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Glucophage",
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Sertraline",
    "picked_from_search": { "rxnorm": "312941", "display": "sertraline 50 MG Oral Tablet" },
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
