---
folio: "0.1"
id: "01EMH493Y0PM0K4P318G50QVYV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2020-10-13"
recorded: "2020-10-13T09:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 10/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17208",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2019-10-01", "precision": "month" },
    "visit_id": "V-2020-101349"
  }
}
```
