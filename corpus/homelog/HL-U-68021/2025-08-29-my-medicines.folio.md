---
folio: "0.1"
id: "01K3VHQ5G8MZHACWAJAXM2872T"
issuer: "did:web:homelog.example"
patient: "HL-U-68021"
effective: "2025-08-29"
recorded: "2025-08-29T18:33:57Z"
author:
  id: "urn:homelog:user:HL-U-68021"
  name: "Thomas Duffy"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 29 August 2025.

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
    "stopped": "2025-05",
    "kind": "prescription",
    "note": "dry cough"
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
    "name": "Escitalopram",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Losartan",
    "picked_from_search": { "rxnorm": "979485", "display": "losartan potassium 50 MG Oral Tablet" },
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Advil",
    "picked_from_search": { "rxnorm": "310965", "display": "ibuprofen 200 MG Oral Tablet" },
    "strength_text": "200 mg",
    "how_i_take_it": "2 when my back hurts, a few times a week",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
