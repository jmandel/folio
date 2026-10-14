---
folio: "0.1"
id: "01JFX3K95G4WYD1VPMDBRXT36R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2024-12-24T13:51:00-06:00"
recorded: "2024-12-24T13:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Insulin glargine started, 10 units at bedtime.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24969",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2024-122444"
  }
}
```
