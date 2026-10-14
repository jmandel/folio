---
folio: "0.1"
id: "01JF5PWZ50NRA0BES1JYXHHSZM"
issuer: "did:web:homelog.example"
patient: "HL-U-44307"
effective: "2024-12-15"
recorded: "2024-12-15T17:47:16Z"
author:
  id: "urn:homelog:user:HL-U-44307"
  name: "Samuel Nguyen"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01HWQZ563RGX58Y9ENP3TATPD2"
---
My Medicines, saved 15 December 2024.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Zestril",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Crestor",
    "picked_from_search": { "rxnorm": "859751", "display": "rosuvastatin calcium 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Dapagliflozin",
    "picked_from_search": { "rxnorm": "1488569", "display": "dapagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
