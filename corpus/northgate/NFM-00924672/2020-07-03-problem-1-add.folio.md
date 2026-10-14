---
folio: "0.1"
id: "01ECB0X420B83H4FEC874T0WZ4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924672"
effective: "2020-07-03"
recorded: "2020-07-03T14:02:00-05:00"
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
    "problem_id": "PL-9462",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-06-01", "precision": "month" },
    "visit_id": "V-2020-070344"
  }
}
```
