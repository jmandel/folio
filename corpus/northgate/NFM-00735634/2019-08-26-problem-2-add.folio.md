---
folio: "0.1"
id: "01DK775DJ0NXM4ZXJRSM36KXAJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2019-08-26"
recorded: "2019-08-26T10:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 DM, onset 2009 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15290",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2019-082618"
  }
}
```
