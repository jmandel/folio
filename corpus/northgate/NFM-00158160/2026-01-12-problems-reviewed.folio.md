---
folio: "0.1"
id: "01KESG40K0FZPAZT0DE1DYY41P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00158160"
effective: "2026-01-12T10:20:00-06:00"
recorded: "2026-01-12T10:20:12-06:00"
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
    "lines_on_list": ["PL-15325", "PL-19394", "PL-18931", "PL-9120"],
    "visit_id": "V-2026-011287"
  }
}
```
