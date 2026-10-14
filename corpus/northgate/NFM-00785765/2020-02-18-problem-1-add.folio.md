---
folio: "0.1"
id: "01E1CC8EN006HEMR2B2CHX55Q9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2020-02-18"
recorded: "2020-02-18T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14442",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2020-021894"
  }
}
```
