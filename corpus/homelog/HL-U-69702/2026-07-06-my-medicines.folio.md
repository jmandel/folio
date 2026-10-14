---
folio: "0.1"
id: "01KWVWAYY8P8YR8MPRM8HPWTCS"
issuer: "did:web:homelog.example"
patient: "HL-U-69702"
effective: "2026-07-06"
recorded: "2026-07-06T14:11:57Z"
author:
  id: "urn:homelog:user:HL-U-69702"
  name: "Ida Hernandez"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 6 July 2026.

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
    "picked_from_search": { "rxnorm": "861004", "display": "metformin hydrochloride 1000 MG Oral Tablet" },
    "strength_text": "1000 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Lipitor",
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Jardiance",
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_6": {
    "type": "my_med",
    "homelog_med_id": "med_6",
    "name": "Insulin glargine",
    "picked_from_search": { "rxnorm": "847230", "display": "insulin glargine 100 UNT/ML Pen Injector" },
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
