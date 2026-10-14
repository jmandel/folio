---
folio: "0.1"
id: "01KYGDQA6G64MZSH855RE8GV0B"
issuer: "did:web:homelog.example"
patient: "HL-U-53173"
effective: "2026-07-26"
recorded: "2026-07-26T23:56:18Z"
author:
  id: "urn:homelog:user:HL-U-53173"
  name: "Rosa Collins"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K95EYQZ8GPNW601SBCRPG0SZ"
---
My Medicines, saved 26 July 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "picked_from_search": { "rxnorm": "979480", "display": "losartan potassium 100 MG Oral Tablet" },
    "strength_text": "100 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Norvasc",
    "strength_text": "5 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Glucophage",
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lipitor",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Escitalopram",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Farxiga",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
