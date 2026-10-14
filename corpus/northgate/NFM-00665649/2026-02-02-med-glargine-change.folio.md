---
folio: "0.1"
id: "01KGG1DXVG98AG3YY1X9TQRPDA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2026-02-02T14:41:00-06:00"
recorded: "2026-02-02T14:41:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change insulin glargine: A1c 8.7.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27199",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 14, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 14 units under the skin at bedtime",
    "reason_text": "A1c 8.7",
    "visit_id": "V-2026-020228"
  }
}
```
