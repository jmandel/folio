---
folio: "0.1"
id: "01KY5FAY9RGME641ZBGGAS4C1K"
issuer: "did:web:homelog.example"
patient: "HL-U-24279"
effective: "2026-07-22"
recorded: "2026-07-22T17:52:51Z"
author:
  id: "urn:homelog:user:HL-U-24279"
  name: "Rosa Liu"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01KMGZRH4GVYJ20VSZ3YNWKETF"
---
My Medicines, saved 22 July 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Chlorthalidone",
    "picked_from_search": { "rxnorm": "197499", "display": "chlorthalidone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Norvasc",
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
