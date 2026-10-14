---
folio: "0.1"
id: "01D4XCE5T05J7NN1C3S3GAGS3H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2019-03-01"
recorded: "2019-03-01T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 6/2011 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17987",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2011-06-01", "precision": "month" },
    "visit_id": "V-2019-030176"
  }
}
```
