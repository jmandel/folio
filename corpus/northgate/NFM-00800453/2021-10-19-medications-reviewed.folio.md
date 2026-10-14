---
folio: "0.1"
id: "01FJD6T4Q08G4MZ8PAT1CDEPH5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2021-10-19T16:20:00-05:00"
recorded: "2021-10-19T16:20:12-05:00"
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
    "lines_on_list": ["ML-37609", "ML-36122"],
    "visit_id": "V-2021-101912"
  }
}
```
