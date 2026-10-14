---
folio: "0.1"
id: "01H4K8K91G05CW4HHWKBCAN8YW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2023-07-05T09:51:00-05:00"
recorded: "2023-07-05T09:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Started insulin glargine 10 units at bedtime today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38994",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2023-070565"
  }
}
```
