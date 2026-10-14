---
folio: "0.1"
id: "01F5XCZC1G97XJGH6V2WCVVY9J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2021-05-17T09:51:00-05:00"
recorded: "2021-05-17T09:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Starting dulaglutide 0.5 mg weekly.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43939",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2021-051769"
  }
}
```
