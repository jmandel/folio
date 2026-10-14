---
folio: "0.1"
id: "01EHATPFG064EA89K3CP60S2NZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2020-09-03"
recorded: "2020-09-03T15:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2006 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15449",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2006-01-01", "precision": "year" },
    "visit_id": "V-2020-090395"
  }
}
```
