---
folio: "0.1"
id: "01FJW414K0BFH2MBFP7FXN798D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2021-10-25T11:20:00-05:00"
recorded: "2021-10-25T11:20:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-27766", "ML-45087", "ML-13467", "ML-19132", "ML-28916", "ML-33966", "ML-16365"],
    "visit_id": "V-2021-102532"
  }
}
```
