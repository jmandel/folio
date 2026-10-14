---
folio: "0.1"
id: "01H11ZPGJ0H26V9VEJ3F2MNA20"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00968157"
effective: "2023-05-22"
recorded: "2023-05-22T10:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2010 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14049",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2023-052265"
  }
}
```
