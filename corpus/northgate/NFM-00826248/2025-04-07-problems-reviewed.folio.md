---
folio: "0.1"
id: "01JR8Q45X0JM5ECY0363FJY07E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00826248"
effective: "2025-04-07T13:10:00-05:00"
recorded: "2025-04-07T13:10:12-05:00"
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
    "lines_on_list": ["PL-11906", "PL-16409"],
    "visit_id": "V-2025-040736"
  }
}
```
