---
folio: "0.1"
id: "01GCEW7RA01C0Y9E4MWVZM16C4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2022-09-08"
recorded: "2022-09-08T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset ~4/2012 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9833",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2012-04-14", "precision": "day" },
    "visit_id": "V-2022-090872"
  }
}
```
