---
folio: "0.1"
id: "01FANXSK10A9GR3VA1RVC8Q94B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2021-07-15T15:30:00-05:00"
recorded: "2021-07-15T15:30:12-05:00"
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
    "lines_on_list": ["ML-28284", "ML-39730", "ML-49477", "ML-23624", "ML-45965"],
    "visit_id": "V-2021-071557"
  }
}
```
