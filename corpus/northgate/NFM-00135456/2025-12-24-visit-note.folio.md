---
folio: "0.1"
id: "01KD9DGDH0M1N14P7WS9EBT7ES"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00135456"
effective: "2025-12-24T13:45:00-06:00"
recorded: "2025-12-24T18:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122471",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122471",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
