---
folio: "0.1"
id: "01FT70E9907188XHRDW1WPJHQE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00110420"
effective: "2022-01-24T12:50:00-06:00"
recorded: "2022-01-24T15:39:00-06:00"
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
    "visit_id": "V-2022-012454",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012454",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-012454",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
