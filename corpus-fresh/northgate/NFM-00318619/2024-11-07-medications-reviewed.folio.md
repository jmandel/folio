---
folio: "0.1"
id: "01JC3T8370K56CGRRT7PPA8JN9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2024-11-07T11:20:00-06:00"
recorded: "2024-11-07T11:20:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "medications",
    "lines_on_list": ["ML-17061", "ML-42640", "ML-26222", "ML-36716", "ML-29195", "ML-13696"],
    "visit_id": "V-2024-110786"
  }
}
```
