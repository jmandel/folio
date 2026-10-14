---
folio: "0.1"
id: "01KHM01P90Q6K1NYR3AWDPW9HX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2026-02-16T13:50:00-06:00"
recorded: "2026-02-16T13:50:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "lines_on_list": ["PL-19637", "PL-17513", "PL-9050"],
    "visit_id": "V-2026-021616"
  }
}
```
