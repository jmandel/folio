---
folio: "0.1"
id: "01DT2JCB9G5Z3ZVEX82XC48G0Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2019-11-19T13:31:00-06:00"
recorded: "2019-11-19T13:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Start insulin glargine 10 units QHS.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26086",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2019-111963"
  }
}
```
