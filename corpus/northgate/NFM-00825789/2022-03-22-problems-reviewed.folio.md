---
folio: "0.1"
id: "01FYS29130QSR68MQX4NRTA4SR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00825789"
effective: "2022-03-22T10:00:00-05:00"
recorded: "2022-03-22T10:00:12-05:00"
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
    "lines_on_list": ["PL-18402", "PL-16580", "PL-19900", "PL-19319", "PL-12198"],
    "visit_id": "V-2022-032252"
  }
}
```
