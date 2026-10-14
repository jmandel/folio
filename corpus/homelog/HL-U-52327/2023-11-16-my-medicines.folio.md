---
folio: "0.1"
id: "01HFCXVW9RDCV0Z71YX4HAC7AH"
issuer: "did:web:homelog.example"
patient: "HL-U-52327"
effective: "2023-11-16"
recorded: "2023-11-16T20:41:23Z"
author:
  id: "urn:homelog:user:HL-U-52327"
  name: "Samuel Mensah"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 16 November 2023.

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
    "name": "Hydrochlorothiazide",
    "picked_from_search": { "rxnorm": "310798", "display": "hydrochlorothiazide 25 MG Oral Tablet" },
    "strength_text": "25 mg",
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
    "name": "Glipizide",
    "picked_from_search": { "rxnorm": "310490", "display": "glipizide 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Coreg",
    "strength_text": "12.5 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Lasix",
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_8": {
    "type": "my_med",
    "homelog_med_id": "med_8",
    "name": "Spironolactone",
    "picked_from_search": { "rxnorm": "313096", "display": "spironolactone 25 MG Oral Tablet" },
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_9": {
    "type": "my_med",
    "homelog_med_id": "med_9",
    "name": "Farxiga",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_10": {
    "type": "my_med",
    "homelog_med_id": "med_10",
    "name": "Insulin glargine",
    "picked_from_search": { "rxnorm": "847230", "display": "3 ML insulin glargine 100 UNT/ML Pen Injector" },
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
