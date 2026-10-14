---
folio: "0.1"
id: "01HGY0KEW06DH38W4N59TAZFQD"
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
<ref id="prob_1">HFrEF, onset ~2018 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14783",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2023-120517"
  }
}
```
