---
folio: "0.1"
id: "01HGY0KEW0Y77TEXXJZPMJCPVX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00760692"
effective: "2023-12-05"
recorded: "2023-12-05T16:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 6/2021 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9278",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2021-06-15", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2023-120517"
  }
}
```
