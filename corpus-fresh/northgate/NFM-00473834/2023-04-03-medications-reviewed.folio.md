---
folio: "0.1"
id: "01GX4794N0BQYVBR8BWWJVD6YG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2023-04-03T13:50:00-05:00"
recorded: "2023-04-03T13:50:12-05:00"
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
    "lines_on_list": ["ML-36476", "ML-14951", "ML-30353", "ML-16259", "ML-22934", "ML-19981", "ML-32004"],
    "visit_id": "V-2023-040352"
  }
}
```
