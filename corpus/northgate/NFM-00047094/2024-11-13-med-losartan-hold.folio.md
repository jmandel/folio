---
folio: "0.1"
id: "01JCKKK1XGX05HB6V4JR7FWDMG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00047094"
effective: "2024-11-13T14:31:00-06:00"
recorded: "2024-11-13T14:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 6 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-29541",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6 confirmed on repeat",
    "review_on": "2024-11-27",
    "visit_id": "V-2024-111366"
  }
}
```
