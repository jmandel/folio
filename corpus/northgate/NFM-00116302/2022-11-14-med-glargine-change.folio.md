---
folio: "0.1"
id: "01GHVNE0SG74PKE1THJZDX2HJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2022-11-14T12:11:00-06:00"
recorded: "2022-11-14T12:11:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change insulin glargine: A1c 8.1.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14795",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2022-111494"
  }
}
```
