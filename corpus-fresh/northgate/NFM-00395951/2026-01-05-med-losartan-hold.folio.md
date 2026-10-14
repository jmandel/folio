---
folio: "0.1"
id: "01KE7YXYCGM4TNJSBE0G8SRMP5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2026-01-05T14:52:00-06:00"
recorded: "2026-01-05T14:52:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.3 confirmed on repeat. Losartan held today, review 1/19.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23814",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.3 confirmed on repeat",
    "review_on": "2026-01-19",
    "visit_id": "V-2026-010579"
  }
}
```
