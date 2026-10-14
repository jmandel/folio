---
folio: "0.1"
id: "01GASCRX8020H9V2VEKZV1XQHK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00472987"
effective: "2022-08-18"
recorded: "2022-08-18T16:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2009 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16814",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2022-081839"
  }
}
```
