---
folio: "0.1"
id: "01HT0FRK0G5VG8W2Z9JMKMW4BC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2024-03-27T12:36:00-05:00"
recorded: "2024-03-27T12:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start semaglutide: A1c 8.4.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43149",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "semaglutide 1 MG/0.75 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2024-032777"
  }
}
```
