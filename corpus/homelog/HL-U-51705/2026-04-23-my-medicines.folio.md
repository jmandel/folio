---
folio: "0.1"
id: "01KPXKANE0F53VS2PABQBG452V"
issuer: "did:web:homelog.example"
patient: "HL-U-51705"
effective: "2026-04-23"
recorded: "2026-04-23T16:38:48Z"
author:
  id: "urn:homelog:user:HL-U-51705"
  name: "Miguel Brown"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 23 April 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314076", "display": "lisinopril 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Norvasc",
    "picked_from_search": { "rxnorm": "197361", "display": "amlodipine 5 MG Oral Tablet" },
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Synthroid",
    "picked_from_search": { "rxnorm": "966222", "display": "levothyroxine sodium 0.075 MG Oral Tablet" },
    "strength_text": "75 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
