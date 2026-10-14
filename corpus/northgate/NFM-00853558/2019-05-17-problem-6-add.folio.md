---
folio: "0.1"
id: "01DB32QJT0K0K8CCXF9VGC9S2P"
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
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14322",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2018-04-08", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2019-051745"
  }
}
```
