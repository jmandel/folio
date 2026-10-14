---
folio: "0.1"
id: "01KFPFC8A0HWGFY7P6KR6E4M88"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2026-01-23T16:25:00-06:00"
recorded: "2026-01-23T16:25:12-06:00"
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
    "lines_on_list": ["ML-46507", "ML-25572", "ML-23145", "ML-33293", "ML-22841", "ML-39543", "ML-35546", "ML-44334"],
    "visit_id": "V-2026-012326"
  }
}
```
