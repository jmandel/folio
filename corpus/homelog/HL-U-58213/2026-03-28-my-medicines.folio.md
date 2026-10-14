---
folio: "0.1"
id: "01KMTFFYM012DNBYBDSS7S2EVN"
issuer: "did:web:homelog.example"
patient: "HL-U-58213"
effective: "2026-03-28"
recorded: "2026-03-28T21:32:39Z"
author:
  id: "urn:homelog:user:HL-U-58213"
  name: "Linda Okafor"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K2ZKN130SFNNKC5BHBQ4487X"
---
My Medicines, saved 28 March 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
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
    "strength_text": "100 mg",
    "how_i_take_it": "1 in the morning",
    "status": "taking",
    "started": "2021-06",
    "kind": "prescription",
    "note": "Replaced the lisinopril. Went up to 100 last August"
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
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Lantus",
    "picked_from_search": { "rxnorm": "847230", "display": "3 ML insulin glargine 100 UNT/ML Pen Injector" },
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime, 12 if my sugar was over 200 that day",
    "status": "taking",
    "started": "2025-08-18",
    "kind": "prescription"
  },
  "med_7": {
    "type": "my_med",
    "homelog_med_id": "med_7",
    "name": "Advil",
    "strength_text": "200 mg",
    "how_i_take_it": "2 when my knee acts up, maybe twice a week",
    "status": "taking",
    "started": "2025",
    "kind": "over_the_counter"
  },
  "med_8": {
    "type": "my_med",
    "homelog_med_id": "med_8",
    "name": "Jardiance",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "status": "stopped",
    "started": "2023-03",
    "stopped": "2024-11",
    "kind": "prescription",
    "note": "Hospital stopped it, I got very sick (DKA). My doctor said never take it again."
  },
  "med_9": {
    "type": "my_med",
    "homelog_med_id": "med_9",
    "name": "Lisinopril",
    "status": "stopped",
    "stopped": "2021",
    "kind": "prescription",
    "note": "made me cough"
  }
}
```
