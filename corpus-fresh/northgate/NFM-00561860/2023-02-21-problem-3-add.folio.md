---
folio: "0.1"
id: "01GSV0TAV0E4BHHPD0AANVT5QS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00561860"
effective: "2023-02-21"
recorded: "2023-02-21T16:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2021 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14601",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2023-022153"
  }
}
```
