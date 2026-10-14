---
folio: "0.1"
id: "01D1V25MF0TYGNBPB5P7HWTZAB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2019-01-22"
recorded: "2019-01-22T09:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13727",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-012224"
  }
}
```
