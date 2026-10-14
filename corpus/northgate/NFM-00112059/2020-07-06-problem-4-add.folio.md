---
folio: "0.1"
id: "01ECJ976P07P390YCEEWEZK1FB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00112059"
effective: "2020-07-06"
recorded: "2020-07-06T09:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18243",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-070616"
  }
}
```
