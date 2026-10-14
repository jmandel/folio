---
folio: "0.1"
id: "01GHH1DWQGVRF3EM8JY2NK9A9E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00168882"
effective: "2022-11-10T09:09:00-06:00"
recorded: "2022-11-10T09:09:42-06:00"
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
    "med_id": "ML-17872",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2022-111094"
  }
}
```
