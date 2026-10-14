---
folio: "0.1"
id: "01M0JMM06GEX5XY0YJV36D495J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2026-08-21T12:06:00-05:00"
recorded: "2026-08-21T12:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Insulin glargine changed to 14 units at bedtime today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-34088",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2026-082181"
  }
}
```
