---
folio: "0.1"
id: "01HPEWTV1GQTTJMS2HF08SMFQK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00397370"
effective: "2024-02-12T08:51:00-06:00"
recorded: "2024-02-12T08:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Start dulaglutide 0.5 mg weekly today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32467",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2024-021295"
  }
}
```
