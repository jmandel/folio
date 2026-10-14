---
folio: "0.1"
id: "01FR3JQD90MB420C0TB23NNBQJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2021-12-29T11:10:00-06:00"
recorded: "2021-12-29T11:10:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "lines_on_list": ["ML-35719", "ML-11476", "ML-38898", "ML-37934", "ML-20415", "ML-22773"],
    "visit_id": "V-2021-122987"
  }
}
```
