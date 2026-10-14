---
folio: "0.1"
id: "01DQQMVPR0RSVBYQYMYS8PCPJB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2019-10-21"
recorded: "2019-10-21T12:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since ~2/2010 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19818",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2010-02-01", "precision": "month" },
    "visit_id": "V-2019-102161"
  }
}
```
