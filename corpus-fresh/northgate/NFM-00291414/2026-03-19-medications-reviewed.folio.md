---
folio: "0.1"
id: "01KM3XSTX0AN25RKTZ05403AXV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2026-03-19T15:50:00-05:00"
recorded: "2026-03-19T15:50:12-05:00"
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
    "lines_on_list": ["ML-49887", "ML-48405", "ML-29182", "ML-46976", "ML-45999", "ML-37766"],
    "visit_id": "V-2026-031975"
  }
}
```
