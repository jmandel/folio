---
folio: "0.1"
id: "01HJHD5MYR6C7QJ9YR07SGVA24"
issuer: "did:web:homelog.example"
patient: "HL-U-51001"
effective: "2023-12-25"
recorded: "2023-12-25T21:12:55Z"
author:
  id: "urn:homelog:user:HL-U-51001"
  name: "Rosa Delgado"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 25 December 2023.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314076", "display": "lisinopril 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "stopped",
    "stopped": "2022-03",
    "kind": "prescription",
    "note": "dry cough"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Amlodipine",
    "picked_from_search": { "rxnorm": "197361", "display": "amlodipine 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Empagliflozin",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "stopped",
    "stopped": "2023-03",
    "kind": "prescription",
    "note": "euglycemic DKA"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Cozaar",
    "picked_from_search": { "rxnorm": "979485", "display": "losartan potassium 50 MG Oral Tablet" },
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Ozempic",
    "picked_from_search": { "rxnorm": "1991302", "display": "semaglutide" },
    "strength_text": "1 mg pen",
    "how_i_take_it": "once a week, Sunday",
    "status": "taking",
    "kind": "prescription"
  }
}
```
