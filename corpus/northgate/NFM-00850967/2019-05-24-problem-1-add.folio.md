---
folio: "0.1"
id: "01DBN7GSC0XTTECT6T0AGC3NWW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850967"
effective: "2019-05-24"
recorded: "2019-05-24T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12337",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-052453"
  }
}
```
