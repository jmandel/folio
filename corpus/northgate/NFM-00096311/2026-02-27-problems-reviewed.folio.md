---
folio: "0.1"
id: "01KJG040D0JP042BGETZ5JE2GY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2026-02-27T10:50:00-06:00"
recorded: "2026-02-27T10:50:12-06:00"
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
    "list": "problems",
    "lines_on_list": ["PL-9416", "PL-9210", "PL-18978"],
    "visit_id": "V-2026-022733"
  }
}
```
