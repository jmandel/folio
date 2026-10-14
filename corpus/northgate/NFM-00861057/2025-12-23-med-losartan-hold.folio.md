---
folio: "0.1"
id: "01KD6NC1JGTFAG7218E0XZ299Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2025-12-23T16:30:00-06:00"
recorded: "2025-12-23T16:30:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 6.2 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-44606",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2026-01-06",
    "visit_id": "V-2025-122355"
  }
}
```
