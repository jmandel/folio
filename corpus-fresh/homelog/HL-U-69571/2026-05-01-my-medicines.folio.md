---
folio: "0.1"
id: "01KQJKBCSRZ8G1RYFPRPR3S1HE"
issuer: "did:web:homelog.example"
patient: "HL-U-69571"
effective: "2026-05-01"
recorded: "2026-05-01T20:23:15Z"
author:
  id: "urn:homelog:user:HL-U-69571"
  name: "Robert Hill"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 1 May 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Naproxen",
    "picked_from_search": { "rxnorm": "849574", "display": "naproxen sodium 220 MG Oral Tablet" },
    "strength_text": "220 mg",
    "how_i_take_it": "1 or 2 for my knee, most days",
    "status": "taking",
    "kind": "over_the_counter"
  }
}
```
