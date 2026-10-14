---
folio: "0.1"
id: "01DW7XYYVG1G68GJK36BCJJYE0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2019-12-16T12:01:00-06:00"
recorded: "2019-12-16T12:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Semaglutide 0.5 mg weekly started today, A1c 8.1.</ref> Pt shown how to use the pen.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16533",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "semaglutide 1 MG/0.75 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2019-121649"
  }
}
```
