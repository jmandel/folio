---
folio: "0.1"
id: "01KJWNT6306HHY05389Y0461FC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2026-03-04T09:00:00-06:00"
recorded: "2026-03-04T09:00:12-06:00"
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
    "lines_on_list": ["ML-18520", "ML-48279", "ML-15426", "ML-19685"],
    "visit_id": "V-2026-030449"
  }
}
```
