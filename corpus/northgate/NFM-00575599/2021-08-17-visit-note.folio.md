---
folio: "0.1"
id: "01FDBBKGX0Y3PX6J7E9YJJX08R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00575599"
effective: "2021-08-17T15:32:00-05:00"
recorded: "2021-08-17T19:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: feeling better.

losartan: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-081785",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
