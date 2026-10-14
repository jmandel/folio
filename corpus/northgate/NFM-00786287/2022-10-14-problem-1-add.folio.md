---
folio: "0.1"
id: "01GFBQZJQ0VC1XXXSPE0582D52"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786287"
effective: "2022-10-14"
recorded: "2022-10-14T12:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia added, onset 8/2016.</ref> History per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17871",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2016-08-01", "precision": "month" },
    "visit_id": "V-2022-101447"
  }
}
```
