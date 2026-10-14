---
folio: "0.1"
id: "01KBDCDVZGSST3V0HG67FHN9XQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2025-12-01T10:37:00-06:00"
recorded: "2025-12-01T10:37:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.5. Insulin glargine started, 10 units at bedtime.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24894",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2025-120196"
  }
}
```
