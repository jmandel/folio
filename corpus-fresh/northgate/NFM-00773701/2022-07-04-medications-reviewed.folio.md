---
folio: "0.1"
id: "01G75F2AZ0A9TNTJW1Q44K265A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2022-07-04T15:40:00-05:00"
recorded: "2022-07-04T15:40:12-05:00"
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
    "lines_on_list": ["ML-34440", "ML-18531", "ML-11693", "ML-46070", "ML-28062", "ML-47760", "ML-18813"],
    "visit_id": "V-2022-070454"
  }
}
```
