---
folio: "0.1"
id: "01G9Z2H28GANHRPP3FSVWRXEHV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2022-08-08T10:52:00-05:00"
recorded: "2022-08-08T10:52:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start losartan: ACE inhibitor cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43627",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "ACE inhibitor cough",
    "visit_id": "V-2022-080855"
  }
}
```
