---
folio: "0.1"
id: "01JS5NJDK0G0H806Z4F0C7AB9C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2025-04-18T14:52:00-05:00"
recorded: "2025-04-18T19:01:00-05:00"
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

metformin: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041838",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
