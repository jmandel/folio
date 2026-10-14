---
folio: "0.1"
id: "01HK3DSPS03E22FADCQH93HEHH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2024-01-01T15:10:00-06:00"
recorded: "2024-01-01T15:10:12-06:00"
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
    "lines_on_list": ["ML-26142", "ML-43191", "ML-12663", "ML-38435"],
    "visit_id": "V-2024-010182"
  }
}
```
