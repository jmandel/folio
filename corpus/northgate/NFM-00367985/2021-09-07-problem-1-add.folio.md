---
folio: "0.1"
id: "01FF0DM2E0VXDB43B8YRS7D6ZG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00367985"
effective: "2021-09-07"
recorded: "2021-09-07T10:22:00-05:00"
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
    "problem_id": "PL-13227",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-11-01", "precision": "month" },
    "visit_id": "V-2021-090719"
  }
}
```
