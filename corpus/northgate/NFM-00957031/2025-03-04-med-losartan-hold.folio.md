---
folio: "0.1"
id: "01JNHFTJWGAQ2FQNJYG2T5E105"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2025-03-04T15:08:00-06:00"
recorded: "2025-03-04T15:08:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 5.6 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18925",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2025-03-18",
    "visit_id": "V-2025-030472"
  }
}
```
