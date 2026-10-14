---
folio: "0.1"
id: "01DYFPT1J0J2REPTNMHKT8978T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00664672"
effective: "2020-01-13"
recorded: "2020-01-13T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2014.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9318",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-011317"
  }
}
```
