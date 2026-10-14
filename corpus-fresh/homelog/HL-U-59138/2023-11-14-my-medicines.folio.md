---
folio: "0.1"
id: "01HF80KQ08KVR4T5APAP4ZP16V"
issuer: "did:web:homelog.example"
patient: "HL-U-59138"
effective: "2023-11-14"
recorded: "2023-11-14T22:53:09Z"
author:
  id: "urn:homelog:user:HL-U-59138"
  name: "Terrence Stewart"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 14 November 2023.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Losartan",
    "picked_from_search": { "rxnorm": "979492", "display": "losartan potassium 50 MG Oral Tablet" },
    "strength_text": "50 mg",
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
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Naproxen",
    "picked_from_search": { "rxnorm": "849574", "display": "naproxen sodium 220 MG Oral Tablet" },
    "strength_text": "220 mg",
    "how_i_take_it": "1 or 2 for my knee, most days",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
