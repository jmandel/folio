---
folio: "0.1"
id: "01GJ3M2RJ08GAW5WYQA0XNVV85"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00147899"
effective: "2022-11-17"
recorded: "2022-11-17T14:22:00-06:00"
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
    "problem_id": "PL-15232",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-06-07", "precision": "day" },
    "visit_id": "V-2022-111713"
  }
}
```
