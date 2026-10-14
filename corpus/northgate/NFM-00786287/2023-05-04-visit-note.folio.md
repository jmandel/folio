---
folio: "0.1"
id: "01GZMKKTZ003HB05B092RHH20Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786287"
effective: "2023-05-04T14:45:00-05:00"
recorded: "2023-05-04T19:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050427",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-050427",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
