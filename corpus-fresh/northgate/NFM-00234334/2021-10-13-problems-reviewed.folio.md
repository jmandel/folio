---
folio: "0.1"
id: "01FHX6P6N0AT455QXSSGRV0E6V"
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
    "list": "problems",
    "lines_on_list": ["PL-14699", "PL-17632", "PL-13142", "PL-13222"],
    "visit_id": "V-2021-101397"
  }
}
```
