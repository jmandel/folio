---
folio: "0.1"
id: "01KQSTXJS0NEP4GDHPTXTNBYCS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2026-05-04T10:50:00-05:00"
recorded: "2026-05-04T10:50:12-05:00"
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
    "lines_on_list": ["PL-09114", "PL-12462", "PL-17682", "PL-13591", "PL-11902"],
    "visit_id": "V-2026-050466"
  }
}
```
