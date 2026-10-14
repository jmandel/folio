---
folio: "0.1"
id: "01GDKCNWP02833WG4JP2A36RF2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00467668"
effective: "2022-09-22"
recorded: "2022-09-22T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 12/2017, per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13125",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2017-12-01", "precision": "month" },
    "visit_id": "V-2022-092214"
  }
}
```
