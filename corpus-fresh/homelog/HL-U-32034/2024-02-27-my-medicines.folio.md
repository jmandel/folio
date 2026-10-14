---
folio: "0.1"
id: "01HQPBXGG8J3VM8KWY56RYV31Z"
issuer: "did:web:homelog.example"
patient: "HL-U-32034"
effective: "2024-02-27"
recorded: "2024-02-27T22:45:41Z"
author:
  id: "urn:homelog:user:HL-U-32034"
  name: "Irene Morris"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 27 February 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314077", "display": "lisinopril 20 MG Oral Tablet" },
    "strength_text": "20 mg",
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
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Zoloft",
    "picked_from_search": { "rxnorm": "312938", "display": "sertraline 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Insulin glargine",
    "picked_from_search": { "rxnorm": "847230", "display": "3 ML insulin glargine 100 UNT/ML Pen Injector" },
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Trulicity",
    "strength_text": "1.5 mg pen",
    "how_i_take_it": "once a week, Sunday",
    "status": "taking",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Dapagliflozin",
    "picked_from_search": { "rxnorm": "1488569", "display": "dapagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
