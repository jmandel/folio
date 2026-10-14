---
folio: "0.1"
id: "01F3RP0FT0ZGC28XP3BMHKV6NF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00295960"
effective: "2021-04-20T12:30:00-05:00"
recorded: "2021-04-20T17:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042036",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042036",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
