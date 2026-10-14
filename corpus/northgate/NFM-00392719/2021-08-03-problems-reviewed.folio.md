---
folio: "0.1"
id: "01FC665RB03T199TC3ZJW15JVB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-08-03T09:20:00-05:00"
recorded: "2021-08-03T09:20:12-05:00"
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
    "lines_on_list": ["PL-17232", "PL-17111", "PL-13206", "PL-15262", "PL-10920"],
    "visit_id": "V-2021-080361"
  }
}
```
