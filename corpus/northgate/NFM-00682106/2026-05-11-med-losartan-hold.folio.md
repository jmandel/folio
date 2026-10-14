---
folio: "0.1"
id: "01KRCBMJ4GTAZCAVTJNCXCF84J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2026-05-11T15:28:00-05:00"
recorded: "2026-05-11T15:28:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 5.9 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27843",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.9 confirmed on repeat",
    "review_on": "2026-05-25",
    "visit_id": "V-2026-051112"
  }
}
```
