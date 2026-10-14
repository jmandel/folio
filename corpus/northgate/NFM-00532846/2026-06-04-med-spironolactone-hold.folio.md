---
folio: "0.1"
id: "01KTA2HJTGB8G22S7FKA08W1RN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00532846"
effective: "2026-06-04T14:42:00-05:00"
recorded: "2026-06-04T14:42:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold spironolactone: K 5.8 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11023",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.8 confirmed on repeat",
    "review_on": "2026-06-18",
    "visit_id": "V-2026-060477"
  }
}
```
