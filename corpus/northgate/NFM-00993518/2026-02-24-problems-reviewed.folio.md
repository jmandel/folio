---
folio: "0.1"
id: "01KJ8EMYS015G3CGGK26WVE9GK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2026-02-24T12:30:00-06:00"
recorded: "2026-02-24T12:30:12-06:00"
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
    "lines_on_list": ["PL-14655", "PL-13200", "PL-11463", "PL-10222", "PL-11546"],
    "visit_id": "V-2026-022411"
  }
}
```
