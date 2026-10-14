---
folio: "0.1"
id: "01KTRXDGBGPCQD1KN9MVHB19PN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2026-06-10T09:01:00-05:00"
recorded: "2026-06-10T09:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Start insulin glargine 10 units at bedtime.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-46510",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2026-061054"
  }
}
```
