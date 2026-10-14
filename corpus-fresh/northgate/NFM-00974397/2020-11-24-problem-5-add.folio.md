---
folio: "0.1"
id: "01EQXSJA40FXZC2P46Z5SEZHMR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00974397"
effective: "2020-11-24"
recorded: "2020-11-24T12:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 5/2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19554",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2015-05-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2020-112429"
  }
}
```
