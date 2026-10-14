---
folio: "0.1"
id: "01GXT10YWGA35ZVGHT43Y0QHQC"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2023-04-11"
recorded: "2023-04-12T06:04:10Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 11 April 2023.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "1 in the morning, 1 at supper",
    "status": "taking",
    "started": "2016",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Losartan",
    "picked_from_search": { "rxnorm": "52175", "display": "losartan" },
    "strength_text": "50 mg",
    "how_i_take_it": "1 in the morning",
    "status": "taking",
    "started": "2021-06",
    "kind": "prescription",
    "note": "Replaced the lisinopril"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "water pill",
    "strength_text": "12.5",
    "how_i_take_it": "morning",
    "status": "taking",
    "started": "2022",
    "kind": "prescription",
    "note": "chlorthalidone I think"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "83367", "display": "atorvastatin" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Sertraline",
    "picked_from_search": { "rxnorm": "312938", "display": "sertraline 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "1 in the morning",
    "status": "taking",
    "started": "2019",
    "kind": "prescription"
  }
}
```
