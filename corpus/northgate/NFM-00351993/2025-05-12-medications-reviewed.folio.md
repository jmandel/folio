---
folio: "0.1"
id: "01JV34FEW018R8QST6J75EEJTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2025-05-12T15:55:00-05:00"
recorded: "2025-05-12T15:55:12-05:00"
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
    "lines_on_list": ["ML-33857", "ML-16142", "ML-39179", "ML-32482", "ML-29230"],
    "visit_id": "V-2025-051237"
  }
}
```
