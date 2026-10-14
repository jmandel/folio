---
folio: "0.1"
id: "01DB32QJT0C08M8JD70HWZESDD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2019-05-17"
recorded: "2019-05-17T09:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 4/2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9433",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2018-04-05", "precision": "day" },
    "visit_id": "V-2019-051745"
  }
}
```
