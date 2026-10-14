---
folio: "0.1"
id: "01JYS7P6ZGRTFK8NHHBPEZC0EX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900007"
effective: "2025-06-27T12:41:00-05:00"
recorded: "2025-06-27T12:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dulaglutide: A1c 8.3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19666",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2025-062787"
  }
}
```
