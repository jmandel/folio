---
folio: "0.1"
id: "01DBZT8MC0T480MQZ7EQW6TJ4K"
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
<ref id="prob_1">Hyperlipidemia since ~2015, per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9610",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-052836"
  }
}
```
