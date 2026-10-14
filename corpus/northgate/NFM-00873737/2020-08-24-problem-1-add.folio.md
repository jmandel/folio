---
folio: "0.1"
id: "01EGGVVJ80VFHKPZVY6KZ1AKV7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2020-08-24"
recorded: "2020-08-24T13:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 11/2010.</ref> Added at first visit here; hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9881",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-11-01", "precision": "month" },
    "visit_id": "V-2020-082472"
  }
}
```
