---
folio: "0.1"
id: "01G6JRMST0YCEEZ4C3XSANBMS0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00138983"
effective: "2022-06-27"
recorded: "2022-06-27T09:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2009 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13604",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2022-062799"
  }
}
```
