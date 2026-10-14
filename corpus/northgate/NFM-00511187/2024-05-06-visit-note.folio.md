---
folio: "0.1"
id: "01HX7NMAB0YSX1BN8T66EKNG6P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00511187"
effective: "2024-05-06T09:40:00-05:00"
recorded: "2024-05-06T14:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "visit_id": "V-2024-050642",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050642",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-050642",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
