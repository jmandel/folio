---
folio: "0.1"
id: "01GPES18S050E53F980KTA95SP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2023-01-10T09:30:00-06:00"
recorded: "2023-01-10T15:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011026",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
