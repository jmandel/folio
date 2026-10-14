---
folio: "0.1"
id: "01E352Q6F0VNFN7T0CF1MZK57P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2020-03-11"
recorded: "2020-03-11T10:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 4/2014. History per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18184",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2014-04-01", "precision": "month" },
    "visit_id": "V-2020-031193"
  }
}
```
