---
folio: "0.1"
id: "01DBZT8MC0MFYD6D71QWS9SK10"
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
<ref id="prob_1">Essential hypertension since ~1/2005, per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10542",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2005-01-01", "precision": "month" },
    "visit_id": "V-2019-052836"
  }
}
```
