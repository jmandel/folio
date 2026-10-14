---
folio: "0.1"
id: "01JZ10K9SGFVBVPW1EG0XJ5SYA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00467668"
effective: "2025-06-30T13:11:00-05:00"
recorded: "2025-06-30T13:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Dulaglutide started at 0.5 mg weekly.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-36336",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2025-063014"
  }
}
```
