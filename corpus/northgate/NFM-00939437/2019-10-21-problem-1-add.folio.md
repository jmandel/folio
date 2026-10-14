---
folio: "0.1"
id: "01DQQXQGS098WJJKGGBH4FAQS2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939437"
effective: "2019-10-21"
recorded: "2019-10-21T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "problem_id": "PL-17347",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2009-07-01", "precision": "month" },
    "visit_id": "V-2019-102111"
  }
}
```
