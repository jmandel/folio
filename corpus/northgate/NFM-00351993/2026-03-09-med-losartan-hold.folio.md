---
folio: "0.1"
id: "01KKA3JAEGJG89501V9AD1PK3F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2026-03-09T15:10:00-05:00"
recorded: "2026-03-09T15:10:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan held today, K 5.7 confirmed on repeat. Review 3/23.</ref> Pt informed by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33857",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.7 confirmed on repeat",
    "review_on": "2026-03-23",
    "visit_id": "V-2026-030943"
  }
}
```
