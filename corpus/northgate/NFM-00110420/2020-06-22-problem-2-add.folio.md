---
folio: "0.1"
id: "01EBE8SRJ0VEAFTCFYBTNPQPYA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00110420"
effective: "2020-06-22"
recorded: "2020-06-22T10:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15996",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2020-062232"
  }
}
```
