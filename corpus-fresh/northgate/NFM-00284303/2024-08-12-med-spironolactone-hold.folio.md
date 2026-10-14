---
folio: "0.1"
id: "01J545Q06GV9PXSAFHRZFW78Z8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00284303"
effective: "2024-08-12T15:50:00-05:00"
recorded: "2024-08-12T15:50:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.6 confirmed on repeat. Spironolactone held today.</ref> Review 8/26.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48070",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2024-08-26",
    "visit_id": "V-2024-081211"
  }
}
```
