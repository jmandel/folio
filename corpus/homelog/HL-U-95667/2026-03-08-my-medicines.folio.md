---
folio: "0.1"
id: "01KK7CB8Z8ETR86F3AQKV3R5DA"
issuer: "did:web:homelog.example"
patient: "HL-U-95667"
effective: "2026-03-08"
recorded: "2026-03-08T18:46:25Z"
author:
  id: "urn:homelog:user:HL-U-95667"
  name: "Kwame Rivera"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 8 March 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "picked_from_search": { "rxnorm": "979492", "display": "losartan potassium 50 MG Oral Tablet" },
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Rosuvastatin",
    "picked_from_search": { "rxnorm": "859751", "display": "rosuvastatin calcium 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Carvedilol",
    "picked_from_search": { "rxnorm": "200032", "display": "carvedilol 12.5 MG Oral Tablet" },
    "strength_text": "12.5 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lasix",
    "strength_text": "40 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Aldactone",
    "strength_text": "25 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
