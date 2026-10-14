---
folio: "0.1"
id: "01KWD0849G1Q9D0F5SDYW3EY6R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2026-06-30T14:31:00-05:00"
recorded: "2026-06-30T14:31:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.5. Dulaglutide 0.5 mg weekly started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11545",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2026-063091"
  }
}
```
