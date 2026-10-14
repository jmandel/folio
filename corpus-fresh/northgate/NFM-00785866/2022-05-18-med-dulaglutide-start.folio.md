---
folio: "0.1"
id: "01G3CC623G559GXDBG562Y6EG6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2022-05-18T15:01:00-05:00"
recorded: "2022-05-18T15:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.9. Start dulaglutide 0.5 mg weekly today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-46986",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.9",
    "visit_id": "V-2022-051863"
  }
}
```
