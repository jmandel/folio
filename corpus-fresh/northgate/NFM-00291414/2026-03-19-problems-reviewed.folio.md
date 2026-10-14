---
folio: "0.1"
id: "01KM3XSTX04T7CXWKW09VAA994"
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
    "list": "problems",
    "lines_on_list": ["PL-14129", "PL-16098", "PL-16380"],
    "visit_id": "V-2026-031975"
  }
}
```
