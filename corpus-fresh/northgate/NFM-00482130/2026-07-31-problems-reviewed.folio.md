---
folio: "0.1"
id: "01KYWE5ZR0VX20TZS1JSN7S8HP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2026-07-31T10:55:00-05:00"
recorded: "2026-07-31T10:55:12-05:00"
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
    "lines_on_list": ["PL-16182", "PL-14063", "PL-18130", "PL-18063"],
    "visit_id": "V-2026-073112"
  }
}
```
