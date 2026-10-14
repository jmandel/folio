---
folio: "0.1"
id: "01EBH0B900GTQ3D5WXSTAG1T14"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00632540"
effective: "2020-06-23"
recorded: "2020-06-23T11:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, since about 2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14512",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2020-062329"
  }
}
```
