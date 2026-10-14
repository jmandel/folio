---
folio: "0.1"
id: "01ECB4194GT7S5HB03W01RDHAM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212854"
effective: "2020-07-03T14:56:00-05:00"
recorded: "2020-07-03T14:56:42-05:00"
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
    "med_id": "ML-21832",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "hydrochlorothiazide 25 MG Oral Tablet", "rxnorm": "310798" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2020-070345"
  }
}
```
