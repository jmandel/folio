---
folio: "0.1"
id: "01HVSB1HCRWQTJQXG7NGVZ3F4V"
issuer: "did:web:homelog.example"
patient: "HL-U-90214"
effective: "2024-04-18"
recorded: "2024-04-18T19:30:55Z"
author:
  id: "urn:homelog:user:HL-U-90214"
  name: "Monique Baker"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HFSF2BBGH8KB4K4D3VS9XK0B"
---
My Medicines, saved 18 April 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Amlodipine",
    "picked_from_search": { "rxnorm": "197361", "display": "amlodipine 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Glucophage",
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Farxiga",
    "picked_from_search": { "rxnorm": "1488569", "display": "dapagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Losartan",
    "picked_from_search": { "rxnorm": "979480", "display": "losartan potassium 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "water pill",
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Aleve",
    "picked_from_search": { "rxnorm": "849574", "display": "naproxen sodium 220 MG Oral Tablet" },
    "strength_text": "220 mg",
    "how_i_take_it": "1 or 2 for my knee, most days",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
