---
folio: "0.1"
id: "01KSDE1150Q9DKRQR9WAEFG733"
issuer: "did:web:homelog.example"
patient: "HL-U-48645"
effective: "2026-05-24"
recorded: "2026-05-24T16:45:24Z"
author:
  id: "urn:homelog:user:HL-U-48645"
  name: "Sharon Phillips"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 24 May 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Glipizide",
    "picked_from_search": { "rxnorm": "310490", "display": "glipizide 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Carvedilol",
    "picked_from_search": { "rxnorm": "200032", "display": "carvedilol 12.5 MG Oral Tablet" },
    "strength_text": "12.5 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Lasix",
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Aldactone",
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription",
    "note": "doctor told me to stop for now"
  },
  "med_8": {
    "type": "my_med",
    "homelog_med_id": "med_8",
    "name": "Farxiga",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_9": {
    "type": "my_med",
    "homelog_med_id": "med_9",
    "name": "Dulaglutide",
    "picked_from_search": { "rxnorm": "1551291", "display": "dulaglutide" },
    "strength_text": "1.5 mg pen",
    "how_i_take_it": "once a week, Sunday",
    "status": "taking",
    "kind": "prescription"
  },
  "med_10": {
    "type": "my_med",
    "homelog_med_id": "med_10",
    "name": "Lantus",
    "picked_from_search": { "rxnorm": "847230", "display": "3 ML insulin glargine 100 UNT/ML Pen Injector" },
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
