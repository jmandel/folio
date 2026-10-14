---
folio: "0.1"
id: "01H1CXRBHGVPZ0WP2NEEPJDFSS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00522444"
effective: "2023-05-26T15:59:00-05:00"
recorded: "2023-05-26T15:59:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.6, confirmed on repeat. Spironolactone held. Review 6/9.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16031",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2023-06-09",
    "visit_id": "V-2023-052664"
  }
}
```
