---
folio: "0.1"
id: "01DBZT8MC0NKXGYRSPRKFQ8B8C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00532846"
effective: "2019-05-28"
recorded: "2019-05-28T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF since ~2018, per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9591",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2019-052836"
  }
}
```
