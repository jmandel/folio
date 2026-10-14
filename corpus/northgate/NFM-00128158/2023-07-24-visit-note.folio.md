---
folio: "0.1"
id: "01H64BC3N07BGT2X9DK75DQTJA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2023-07-24T08:50:00-05:00"
recorded: "2023-07-24T11:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

dulaglutide: started 0.5 mg weekly today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072436",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072436",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
