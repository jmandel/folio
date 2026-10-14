---
folio: "0.1"
id: "01KTMH1XWGK341T7K0YGKFR7P3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2026-06-08T16:08:00-05:00"
recorded: "2026-06-08T16:08:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.6 confirmed on repeat. Losartan held today.</ref> Review 6/22.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-34530",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2026-06-22",
    "visit_id": "V-2026-060869"
  }
}
```
