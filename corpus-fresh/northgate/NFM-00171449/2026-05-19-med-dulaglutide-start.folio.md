---
folio: "0.1"
id: "01KS0RD7MGGF3W7M5Z5F9XSJPV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2026-05-19T13:36:00-05:00"
recorded: "2026-05-19T13:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Start dulaglutide 0.5 mg weekly.</ref> Pt shown pen use.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-28704",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2026-051961"
  }
}
```
