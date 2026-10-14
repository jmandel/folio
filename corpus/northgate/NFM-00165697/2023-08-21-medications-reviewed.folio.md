---
folio: "0.1"
id: "01H8CRXVE04FRNBD9FN6W0H5KD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2023-08-21T14:25:00-05:00"
recorded: "2023-08-21T14:25:12-05:00"
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
    "lines_on_list": ["ML-15926", "ML-28460", "ML-43377", "ML-23683"],
    "visit_id": "V-2023-082133"
  }
}
```
