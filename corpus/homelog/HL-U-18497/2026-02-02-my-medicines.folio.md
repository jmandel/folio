---
folio: "0.1"
id: "01KGFP6XJG5ZJ89TGWMWVHWFRV"
issuer: "did:web:homelog.example"
patient: "HL-U-18497"
effective: "2026-02-02"
recorded: "2026-02-02T17:25:38Z"
author:
  id: "urn:homelog:user:HL-U-18497"
  name: "Andre Davis"
  role: "Patient"
schema:
  url: "https://homelog.example/folio/schemas/homelog-v1.d.ts"
  type: "HomeLogEntry"
  sha256: "481bb3d1a45c6526b7c7983c1401c31cd90e1464117f3eb27a0ffad69991ef34"
---
My Medicines, saved 2 February 2026.

```json payload
{
  "med_1": {
    "type": "my_med",
    "homelog_med_id": "med_1",
    "name": "Lipitor",
    "strength_text": "40 mg",
    "how_i_take_it": "bedtime",
    "status": "taking",
    "kind": "prescription"
  }
}
```
