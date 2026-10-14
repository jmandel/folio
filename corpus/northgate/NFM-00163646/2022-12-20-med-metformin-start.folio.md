---
folio: "0.1"
id: "01GMRHZFGG7PG8VDK5HYF67K0V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00163646"
effective: "2022-12-20T14:00:00-06:00"
recorded: "2022-12-20T14:00:42-06:00"
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
    "med_id": "ML-42685",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "visit_id": "V-2022-122093"
  }
}
```
