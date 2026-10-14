---
folio: "0.1"
id: "01J8JT9B2GJJ0Z2AQAT0SPBQJ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2024-09-24T15:06:00-05:00"
recorded: "2024-09-24T15:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start insulin glargine: A1c 8.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-17898",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8",
    "visit_id": "V-2024-092478"
  }
}
```
