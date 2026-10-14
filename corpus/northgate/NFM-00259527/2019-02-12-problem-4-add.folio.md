---
folio: "0.1"
id: "01D3H3N8J0J5K0Q32047R015YJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2019-02-12"
recorded: "2019-02-12T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9015",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2016-11-01", "precision": "month" },
    "visit_id": "V-2019-021253"
  }
}
```
