---
folio: "0.1"
id: "01F9H7B6A028R7W3DC3X3EZNY9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2021-07-01T09:25:00-05:00"
recorded: "2021-07-01T09:25:12-05:00"
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
    "lines_on_list": ["PL-12481", "PL-11726", "PL-18476", "PL-11934"],
    "visit_id": "V-2021-070116"
  }
}
```
