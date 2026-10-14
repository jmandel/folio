---
folio: "0.1"
id: "01GMEFA5BGJT0MXBMYJNXTGW48"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2022-12-16T16:01:00-06:00"
recorded: "2022-12-16T16:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dulaglutide: A1c 8.5.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25906",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2022-121688"
  }
}
```
