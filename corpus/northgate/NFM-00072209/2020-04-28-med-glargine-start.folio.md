---
folio: "0.1"
id: "01E70F8D6GH09AZV8S55GEB9C7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2020-04-28T08:22:00-05:00"
recorded: "2020-04-28T08:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start insulin glargine: A1c 8.4.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10085",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2020-042866"
  }
}
```
