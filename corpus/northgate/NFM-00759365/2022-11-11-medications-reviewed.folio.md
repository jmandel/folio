---
folio: "0.1"
id: "01GHM39XB03V3K01FGAH5TM27W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-11T13:40:00-06:00"
recorded: "2022-11-11T13:40:12-06:00"
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
    "lines_on_list": ["ML-12038", "ML-46613", "ML-45140", "ML-32136", "ML-40647", "ML-34613"],
    "visit_id": "V-2022-111138"
  }
}
```
