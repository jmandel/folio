---
folio: "0.1"
id: "01FHX6P6N00VGMKR9H94PV09SN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00234334"
effective: "2021-10-13T11:10:00-05:00"
recorded: "2021-10-13T11:10:12-05:00"
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
    "lines_on_list": ["ML-40896", "ML-36309", "ML-32784", "ML-13048", "ML-16147"],
    "visit_id": "V-2021-101397"
  }
}
```
