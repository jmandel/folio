---
folio: "0.1"
id: "01K63WYEF8EK1MJ4XAT2T33WX2"
issuer: "did:web:homelog.example"
patient: "HL-U-43902"
effective: "2025-09-26"
recorded: "2025-09-26T20:55:29Z"
author:
  id: "urn:homelog:user:HL-U-43902"
  name: "Linda Kowalski"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 26 September 2025.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
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
    "name": "Jardiance",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Advil",
    "strength_text": "200 mg",
    "how_i_take_it": "2 when my back hurts, a few times a week",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
