---
folio: "0.1"
id: "01FAGK91N0JJW6EQYHJ6GRQTBW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2021-07-13T13:50:00-05:00"
recorded: "2021-07-13T13:50:12-05:00"
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
    "lines_on_list": ["PL-19947", "PL-11786", "PL-9960"],
    "visit_id": "V-2021-071365"
  }
}
```
