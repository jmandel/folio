---
folio: "0.1"
id: "01GCF2DW50NMQQMEBDN37JY66Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2022-09-08T12:30:00-05:00"
recorded: "2022-09-08T12:30:12-05:00"
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
    "lines_on_list": ["PL-16584", "PL-12982", "PL-14627"],
    "visit_id": "V-2022-090856"
  }
}
```
