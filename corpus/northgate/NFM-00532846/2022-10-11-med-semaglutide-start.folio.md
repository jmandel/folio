---
folio: "0.1"
id: "01GF3WFHKGP614YGCAMWNHJE43"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00532846"
effective: "2022-10-11T11:01:00-05:00"
recorded: "2022-10-11T11:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start semaglutide: A1c 8.2.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30443",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "semaglutide 1 MG/0.75 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2022-101151"
  }
}
```
