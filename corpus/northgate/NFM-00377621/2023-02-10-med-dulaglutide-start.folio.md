---
folio: "0.1"
id: "01GRY7TYVGAA4SG6MJJ3Z96C5J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2023-02-10T12:01:00-06:00"
recorded: "2023-02-10T12:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dulaglutide: A1c 8.2.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-17591",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2023-021082"
  }
}
```
