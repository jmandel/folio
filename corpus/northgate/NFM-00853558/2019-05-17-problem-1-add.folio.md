---
folio: "0.1"
id: "01DB32QJT0CZJJ5DHMNVZ5S079"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2019-05-17"
recorded: "2019-05-17T09:22:00-05:00"
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
    "problem_id": "PL-17696",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2016-05-02", "precision": "day" },
    "visit_id": "V-2019-051745"
  }
}
```
