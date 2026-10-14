---
folio: "0.1"
id: "01GBXEAZ805GVXZNFSAJD9ZF1C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00345310"
effective: "2022-09-01"
recorded: "2022-09-01T16:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, onset 2013 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14678",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2022-090195"
  }
}
```
