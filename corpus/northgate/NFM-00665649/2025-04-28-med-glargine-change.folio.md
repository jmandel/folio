---
folio: "0.1"
id: "01JSYB88BG2R39JKM2V9AW4RFC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2025-04-28T09:01:00-05:00"
recorded: "2025-04-28T09:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change insulin glargine: A1c 8.3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27018",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "3 ML insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2025-042858"
  }
}
```
