---
folio: "0.1"
id: "01GW5BQWDG0JAE26HHMBT5KJKM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2023-03-22T14:11:00-05:00"
recorded: "2023-03-22T14:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6 confirmed on repeat. Spironolactone 25 mg held today.</ref> Review 4/5.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13881",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6 confirmed on repeat",
    "review_on": "2023-04-05",
    "visit_id": "V-2023-032222"
  }
}
```
