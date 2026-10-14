---
folio: "0.1"
id: "01FMX033A0XFN73ND4PXKZ9SAB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00677364"
effective: "2021-11-19"
recorded: "2021-11-19T15:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 10/2010.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17346",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-10-19", "precision": "day" },
    "visit_id": "V-2021-111975"
  }
}
```
