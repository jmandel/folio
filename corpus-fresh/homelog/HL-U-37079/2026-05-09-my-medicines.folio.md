---
folio: "0.1"
id: "01KR7913CR4WC8VN5FAQB6A4YF"
issuer: "did:web:homelog.example"
patient: "HL-U-37079"
effective: "2026-05-09"
recorded: "2026-05-09T21:06:55Z"
author:
  id: "urn:homelog:user:HL-U-37079"
  name: "Hector Mensah"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 9 May 2026.

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
    "name": "Glucophage",
    "picked_from_search": { "rxnorm": "861007", "display": "metformin hydrochloride 500 MG Oral Tablet" },
    "strength_text": "500 mg",
    "how_i_take_it": "morning and supper",
    "status": "taking",
    "kind": "prescription"
  },
  "med_3": {
    "type": "my_med",
    "homelog_med_id": "med_3",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "617310", "display": "atorvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_4": {
    "type": "my_med",
    "homelog_med_id": "med_4",
    "name": "Empagliflozin",
    "picked_from_search": { "rxnorm": "1545658", "display": "empagliflozin 10 MG Oral Tablet" },
    "strength_text": "10 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  }
}
```
