---
folio: "0.1"
id: "01ES20VFG0NMCQDSQ6SE4X7Q7N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2020-12-08"
recorded: "2020-12-08T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2016.</ref> Added at first visit here; history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18130",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-120821"
  }
}
```
