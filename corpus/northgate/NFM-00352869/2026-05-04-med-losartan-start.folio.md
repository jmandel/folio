---
folio: "0.1"
id: "01KQT5DJQG8BBJJTFCY6JZTVY8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00352869"
effective: "2026-05-04T13:53:00-05:00"
recorded: "2026-05-04T13:53:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan 50 mg daily started today for ACE inhibitor cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30502",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "ACE inhibitor cough",
    "visit_id": "V-2026-050425"
  }
}
```
