---
folio: "0.1"
id: "01G5SNEN20AF9Z9BXMCPPE543P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00349670"
effective: "2022-06-17T15:25:00-05:00"
recorded: "2022-06-17T15:25:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "lines_on_list": ["ML-19714", "ML-47780", "ML-21174", "ML-24391"],
    "visit_id": "V-2022-061785"
  }
}
```
