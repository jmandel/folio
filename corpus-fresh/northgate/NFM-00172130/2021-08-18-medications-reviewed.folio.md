---
folio: "0.1"
id: "01FDCTPV901VPSKE10583T35MN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2021-08-18T09:30:00-05:00"
recorded: "2021-08-18T09:30:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-16611", "ML-27941", "ML-27624", "ML-36933", "ML-26714"],
    "visit_id": "V-2021-081874"
  }
}
```
