---
folio: "0.1"
id: "01EXSKDE3GFY8NV80RR7Z2DEET"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2021-02-05T11:21:00-06:00"
recorded: "2021-02-05T11:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3. Starting insulin glargine pen, 10 units at bedtime.</ref> Teaching done in office.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-47760",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2021-020581"
  }
}
```
