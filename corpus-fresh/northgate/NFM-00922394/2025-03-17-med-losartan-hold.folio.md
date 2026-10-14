---
folio: "0.1"
id: "01JPJWPP4GCAHNM2ZPTJNX3VHS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2025-03-17T15:28:00-05:00"
recorded: "2025-03-17T15:28:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.8 confirmed on repeat. Losartan held today.</ref> Review 3/31.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39543",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.8 confirmed on repeat",
    "review_on": "2025-03-31",
    "visit_id": "V-2025-031751"
  }
}
```
