---
folio: "0.1"
id: "01HJKMHFZ05YGN41W1V6ST8GRD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2023-12-26T12:00:00-06:00"
recorded: "2023-12-26T12:00:12-06:00"
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
    "lines_on_list": ["ML-15097", "ML-37878"],
    "visit_id": "V-2023-122658"
  }
}
```
