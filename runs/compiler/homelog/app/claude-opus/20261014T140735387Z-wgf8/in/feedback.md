# Feedback: counterexamples from expected outputs

Your mapper was run on other patients of this source and compared with the expected output. 1 rows were wrong
in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data
correctly in general, not only for these patients.

## Patient HL-U-62713, medications `levothyroxine`

- dose: expected {"value":75,"unit":"mg"}, got {"value":75,"unit":"mcg"}

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01K7ZBV9RGVEZKJTWDGCMZEB3B"
issuer: "did:web:homelog.example"
patient: "HL-U-62713"
effective: "2025-10-19"
recorded: "2025-10-19T23:11:06Z"
author:
  id: "urn:homelog:user:HL-U-62713"
  name: "William Wilson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 19 October 2025.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Metformin",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "stopped",
    "stopped": "2025-07",
    "kind": "prescription",
    "note": "eGFR 29"
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
    "name": "Escitalopram",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
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
  },
  "med_5": {
    "type": "my_med",
    "homelog_med_id": "med_5",
    "name": "Lantus",
    "strength_text": "100 units/mL pen",
    "how_i_take_it": "10 units at bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
````
</details>

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KY02X30G1E29YKCVNEDT0DVJ"
issuer: "did:web:homelog.example"
patient: "HL-U-62713"
effective: "2026-07-20"
recorded: "2026-07-20T15:39:22Z"
author:
  id: "urn:homelog:user:HL-U-62713"
  name: "William Wilson"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K7ZBV9RGVEZKJTWDGCMZEB3B"
---
My Medicines, saved 20 July 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Glucophage",
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "stopped",
    "stopped": "2025-07",
    "kind": "prescription",
    "note": "eGFR 29"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Crestor",
    "picked_from_search": { "rxnorm": "859751", "display": "rosuvastatin calcium 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Escitalopram",
    "picked_from_search": { "rxnorm": "349332", "display": "escitalopram 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
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
  }
}
```
````
</details>
