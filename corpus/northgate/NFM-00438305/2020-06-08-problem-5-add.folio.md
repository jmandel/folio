---
folio: "0.1"
id: "01EAAKTH60SRAZKRFHY4CVTKWQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2020-06-08"
recorded: "2020-06-08T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14621",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-060826"
  }
}
```
