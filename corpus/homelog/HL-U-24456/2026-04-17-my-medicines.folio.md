---
folio: "0.1"
id: "01KPE3AXXRBMFSHBHJ413MYSCH"
issuer: "did:web:homelog.example"
patient: "HL-U-24456"
effective: "2026-04-17"
recorded: "2026-04-17T16:10:43Z"
author:
  id: "urn:homelog:user:HL-U-24456"
  name: "Amina Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 17 April 2026.

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
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Coreg",
    "picked_from_search": { "rxnorm": "200032", "display": "carvedilol 12.5 MG Oral Tablet" },
    "strength_text": "12.5 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Furosemide",
    "picked_from_search": { "rxnorm": "313988", "display": "furosemide 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Aldactone",
    "picked_from_search": { "rxnorm": "313096", "display": "spironolactone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Jardiance",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Jardiance",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "stopped",
    "stopped": "2024-09",
    "kind": "prescription",
    "note": "euglycemic DKA"
  }
}
```
