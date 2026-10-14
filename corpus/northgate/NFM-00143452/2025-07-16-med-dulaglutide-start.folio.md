---
folio: "0.1"
id: "01K0A1T0BGR3CF00W5GM4DN78D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2025-07-16T11:41:00-05:00"
recorded: "2025-07-16T11:41:42-05:00"
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
    "med_id": "ML-27060",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2025-071624"
  }
}
```
