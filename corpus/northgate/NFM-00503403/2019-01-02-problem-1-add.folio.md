---
folio: "0.1"
id: "01D07G75P053HF5S9TS2T1PBV7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2019-01-02"
recorded: "2019-01-02T08:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 4/2010.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19412",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2010-04-01", "precision": "month" },
    "visit_id": "V-2019-010214"
  }
}
```
