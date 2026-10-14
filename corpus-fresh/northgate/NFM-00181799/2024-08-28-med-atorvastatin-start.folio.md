---
folio: "0.1"
id: "01J6CR1MCGJ8PQS8EBQB8X7J48"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00181799"
effective: "2024-08-28T10:00:00-05:00"
recorded: "2024-08-28T10:00:42-05:00"
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
    "med_id": "ML-15920",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 40 MG Oral Tablet", "rxnorm": "617311" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2024-082818"
  }
}
```
