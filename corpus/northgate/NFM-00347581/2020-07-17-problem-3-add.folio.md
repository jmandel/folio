---
folio: "0.1"
id: "01EDF8FED0HR04NYXPB241XYQW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2020-07-17"
recorded: "2020-07-17T15:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2005.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10657",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2005-03-26", "precision": "day" },
    "visit_id": "V-2020-071779"
  }
}
```
