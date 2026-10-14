---
folio: "0.1"
id: "01DTSRHNT01G54JJSCS3CMZ22D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2019-11-28"
recorded: "2019-11-28T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee since 3/2012 per pt. Added to problem list at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16234",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2012-03-01", "precision": "month" },
    "visit_id": "V-2019-112831"
  }
}
```
