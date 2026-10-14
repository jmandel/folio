---
folio: "0.1"
id: "01F8T3RT307DXY8XT8ZNHJ2QVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2021-06-22T10:00:00-05:00"
recorded: "2021-06-22T10:00:12-05:00"
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
    "lines_on_list": ["PL-17244", "PL-17449", "PL-15554", "PL-14933", "PL-13727", "PL-19207"],
    "visit_id": "V-2021-062212"
  }
}
```
