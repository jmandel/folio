---
folio: "0.1"
id: "01H5TCT2NG6SNQGREPCC6A5AWJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2023-07-20T14:35:00-05:00"
recorded: "2023-07-20T14:35:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold spironolactone: K 6.2 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-41216",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2023-08-03",
    "visit_id": "V-2023-072075"
  }
}
```
