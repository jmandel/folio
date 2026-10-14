---
folio: "0.1"
id: "01EPW4DZSG732QQFM31N89DQC1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727449"
effective: "2020-11-11T11:07:00-06:00"
recorded: "2020-11-11T11:07:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27370",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "glipizide 5 MG Oral Tablet", "rxnorm": "310490" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2020-111172"
  }
}
```
