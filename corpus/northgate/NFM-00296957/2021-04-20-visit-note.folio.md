---
folio: "0.1"
id: "01F3R2CE50N8R04C314TAWEVAJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2021-04-20T08:10:00-05:00"
recorded: "2021-04-20T11:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042032",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
