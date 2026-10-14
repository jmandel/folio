---
folio: "0.1"
id: "01EG16KH00HJX0NK6QMCQEM03P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2020-08-18"
recorded: "2020-08-18T11:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 3/2010 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9784",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2010-03-04", "precision": "day" },
    "visit_id": "V-2020-081859"
  }
}
```
