---
folio: "0.1"
id: "01HRYM9JBGXSQP7NEF2KCZ2N1T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2024-03-14T09:01:00-05:00"
recorded: "2024-03-14T09:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Insulin glargine up to 14 units QHS.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26086",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2024-031483"
  }
}
```
