---
folio: "0.1"
id: "01JGCSTEGGABW10TNAR6DT3CPZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230108"
effective: "2024-12-30T16:08:00-06:00"
recorded: "2024-12-30T16:08:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Spironolactone held, K 6.2 confirmed on repeat.</ref> Review 1/13.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48888",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2025-01-13",
    "visit_id": "V-2024-123036"
  }
}
```
