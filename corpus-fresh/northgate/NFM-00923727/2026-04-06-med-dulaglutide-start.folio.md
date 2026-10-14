---
folio: "0.1"
id: "01KNHY5KZGBFV3XHAJKM94TETP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2026-04-06T12:41:00-05:00"
recorded: "2026-04-06T12:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Dulaglutide 0.5 mg weekly started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-31560",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2026-040624"
  }
}
```
