---
folio: "0.1"
id: "01K54PDDD0T79NWN1ZFWXA9JF9"
issuer: "did:web:homelog.example"
patient: "HL-U-42118"
effective: "2025-09-14"
recorded: "2025-09-14T18:04:52Z"
author:
  id: "urn:homelog:user:HL-U-42118"
  name: "David Garcia"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 14 September 2025.

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
    "stopped": "2023-11",
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
    "name": "Losartan",
    "picked_from_search": { "rxnorm": "979480", "display": "losartan potassium 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Ibuprofen",
    "picked_from_search": { "rxnorm": "310965", "display": "ibuprofen 200 MG Oral Tablet" },
    "strength_text": "200 mg",
    "how_i_take_it": "2 when my back hurts, a few times a week",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
