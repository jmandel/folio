---
folio: "0.1"
id: "01G75F2AZ0DHAD0JZSETF70WKA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2022-07-04T15:40:00-05:00"
recorded: "2022-07-04T15:40:12-05:00"
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
    "lines_on_list": ["PL-19673", "PL-19122", "PL-15138", "PL-10532", "PL-13379"],
    "visit_id": "V-2022-070454"
  }
}
```
