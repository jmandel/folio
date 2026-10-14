---
folio: "0.1"
id: "01DEW9D2JGG7HDQ5C7EN2Q60D9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2019-07-03T11:06:00-05:00"
recorded: "2019-07-03T11:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3. Insulin glargine started, 10 units QHS.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38948",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2019-070399"
  }
}
```
