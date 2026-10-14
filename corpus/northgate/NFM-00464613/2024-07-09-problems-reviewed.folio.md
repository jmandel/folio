---
folio: "0.1"
id: "01J2CHA370F1V37TJP11NEZZR5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00464613"
effective: "2024-07-09T15:00:00-05:00"
recorded: "2024-07-09T15:00:12-05:00"
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
    "lines_on_list": ["PL-13157", "PL-12953", "PL-12594", "PL-9960"],
    "visit_id": "V-2024-070937"
  }
}
```
