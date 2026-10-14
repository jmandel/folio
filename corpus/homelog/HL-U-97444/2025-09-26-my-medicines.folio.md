---
folio: "0.1"
id: "01K639QSH04NMW560NZR3GZBPK"
issuer: "did:web:homelog.example"
patient: "HL-U-97444"
effective: "2025-09-26"
recorded: "2025-09-26T15:19:48Z"
author:
  id: "urn:homelog:user:HL-U-97444"
  name: "Doris Chen"
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
    "name": "Lisinopril",
    "picked_from_search": { "rxnorm": "314077", "display": "lisinopril 20 MG Oral Tablet" },
    "strength_text": "20 mg",
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
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
