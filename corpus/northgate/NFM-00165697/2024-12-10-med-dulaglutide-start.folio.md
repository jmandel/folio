---
folio: "0.1"
id: "01JERXEQNGQHGSSGRBM1AH5EH9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2024-12-10T12:31:00-06:00"
recorded: "2024-12-10T12:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-14685",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2024-121048"
  }
}
```
