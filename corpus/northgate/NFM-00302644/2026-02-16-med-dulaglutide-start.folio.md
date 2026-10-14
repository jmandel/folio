---
folio: "0.1"
id: "01KHM5VHHGZW24XVN2B8YCSSRR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00302644"
effective: "2026-02-16T15:31:00-06:00"
recorded: "2026-02-16T15:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Dulaglutide 0.5 mg weekly started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32875",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2026-021634"
  }
}
```
