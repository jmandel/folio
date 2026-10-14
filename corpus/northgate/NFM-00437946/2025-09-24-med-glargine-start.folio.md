---
folio: "0.1"
id: "01K5YFBDQGP2V0P8DY0P9QVNRY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437946"
effective: "2025-09-24T13:21:00-05:00"
recorded: "2025-09-24T13:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Insulin glargine 10 units at bedtime started today. A1c 8.5.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30754",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2025-092449"
  }
}
```
