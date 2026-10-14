---
folio: "0.1"
id: "01KNAAF0A8BQMY9QKJDDMFQ4R5"
issuer: "did:web:homelog.example"
patient: "HL-U-34946"
effective: "2026-04-03"
recorded: "2026-04-03T18:42:37Z"
author:
  id: "urn:homelog:user:HL-U-34946"
  name: "John Morris"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
supersedes:
  - "01K95PA3787Y8NEV128E98PK2C"
---
My Medicines, saved 3 April 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Crestor",
    "picked_from_search": { "rxnorm": "859751", "display": "rosuvastatin 20 MG Oral Tablet" },
    "strength_text": "20 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Naproxen",
    "picked_from_search": { "rxnorm": "849574", "display": "naproxen 220 MG Oral Tablet" },
    "strength_text": "220 mg",
    "how_i_take_it": "1 or 2 for my knee, most days",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
