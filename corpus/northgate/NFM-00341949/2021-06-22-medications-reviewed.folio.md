---
folio: "0.1"
id: "01F8T3RT3075KQH4QNBH38R6ZH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2021-06-22T10:00:00-05:00"
recorded: "2021-06-22T10:00:12-05:00"
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
    "lines_on_list": ["ML-44895", "ML-24995", "ML-37802", "ML-37777", "ML-12172", "ML-40649", "ML-27838", "ML-38601"],
    "visit_id": "V-2021-062212"
  }
}
```
