---
folio: "0.1"
id: "01GQSTHH4GP68RXNEQGPZENMKQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00530802"
effective: "2023-01-27T08:36:00-06:00"
recorded: "2023-01-27T08:36:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start semaglutide: A1c 8.1.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-49355",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "semaglutide 1 MG/0.75 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2023-012771"
  }
}
```
