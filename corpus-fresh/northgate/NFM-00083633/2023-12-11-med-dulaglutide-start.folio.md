---
folio: "0.1"
id: "01HHCMMY5G11JTHZZ5JCV56KEG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2023-12-11T08:31:00-06:00"
recorded: "2023-12-11T08:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dulaglutide 0.5 mg weekly started, A1c 8.3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-31117",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2023-121191"
  }
}
```
