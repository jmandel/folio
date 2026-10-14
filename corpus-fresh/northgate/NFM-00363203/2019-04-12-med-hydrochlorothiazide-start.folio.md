---
folio: "0.1"
id: "01D88W7FGGNAHPK30GS5A5VR7B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2019-04-12T08:36:00-05:00"
recorded: "2019-04-12T08:36:42-05:00"
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
    "med_id": "ML-10036",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "hydrochlorothiazide 25 MG Oral Tablet", "rxnorm": "310798" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2019-041226"
  }
}
```
