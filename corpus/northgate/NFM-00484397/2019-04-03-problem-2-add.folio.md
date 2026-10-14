---
folio: "0.1"
id: "01D7HPYQ20K8KQJJ85AVGD8THJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2019-04-03"
recorded: "2019-04-03T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13866",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2013-03-01", "precision": "month" },
    "visit_id": "V-2019-040393"
  }
}
```
