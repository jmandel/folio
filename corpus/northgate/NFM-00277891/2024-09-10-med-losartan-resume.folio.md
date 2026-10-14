---
folio: "0.1"
id: "01J7E8DDVGH8AQ49AY000REXTH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2024-09-10T10:21:00-05:00"
recorded: "2024-09-10T10:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Losartan resumed at 100 mg daily.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30129",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-091074"
  }
}
```
