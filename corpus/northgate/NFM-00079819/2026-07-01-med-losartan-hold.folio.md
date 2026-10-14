---
folio: "0.1"
id: "01KWFNGCZGP8SSEK15CVXDDWG8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00079819"
effective: "2026-07-01T15:21:00-05:00"
recorded: "2026-07-01T15:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 5.6 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10142",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2026-07-15",
    "visit_id": "V-2026-070155"
  }
}
```
