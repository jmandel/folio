---
folio: "0.1"
id: "01D2B00AS02HAJNM0TMBFGFZ27"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2019-01-28"
recorded: "2019-01-28T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset ~10/2011 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19982",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2011-10-01", "precision": "month" },
    "visit_id": "V-2019-012891"
  }
}
```
