---
folio: "0.1"
id: "01JV34FEW0QZAW11NNPAKDHHEV"
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
    "list": "problems",
    "lines_on_list": ["PL-11371", "PL-9900", "PL-10416", "PL-18907", "PL-17217", "PL-18396"],
    "visit_id": "V-2025-051294"
  }
}
```
