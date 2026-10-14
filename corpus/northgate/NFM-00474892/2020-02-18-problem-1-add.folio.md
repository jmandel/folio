---
folio: "0.1"
id: "01E1CR8ZB0XR02DKWDW61CSZ6G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2020-02-18"
recorded: "2020-02-18T12:17:00-06:00"
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
    "problem_id": "PL-9183",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2012-04-01", "precision": "month" },
    "visit_id": "V-2020-021851"
  }
}
```
