---
folio: "0.1"
id: "01KCMER80G5T0CDG0V9X0KJDZF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00056738"
effective: "2025-12-16T14:48:00-06:00"
recorded: "2025-12-16T14:48:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6 confirmed on repeat. Losartan held today, review 12/30.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-22096",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6 confirmed on repeat",
    "review_on": "2025-12-30",
    "visit_id": "V-2025-121651"
  }
}
```
