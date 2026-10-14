---
folio: "0.1"
id: "01KFS4H4K84H3WQQ84ZPM7NE1B"
issuer: "did:web:homelog.example"
patient: "HL-U-79006"
effective: "2026-01-24"
recorded: "2026-01-24T23:13:21Z"
author:
  id: "urn:homelog:user:HL-U-79006"
  name: "Denise Harris"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 24 January 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Cozaar",
    "picked_from_search": { "rxnorm": "979485", "display": "losartan potassium 50 MG Oral Tablet" },
    "strength_text": "50 mg",
    "how_i_take_it": "morning",
    "status": "taking",
    "kind": "prescription"
  },
  "med_2": {
    "type": "my_med",
    "homelog_med_id": "med_2",
    "name": "Atorvastatin",
    "picked_from_search": { "rxnorm": "617311", "display": "atorvastatin 40 MG Oral Tablet" },
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
