---
folio: "0.1"
id: "01K2D5EZJGEV3WWHPJ554GMER7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2025-08-11T13:14:00-05:00"
recorded: "2025-08-11T13:14:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril stopped, angioedema.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-22231",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "angioedema",
    "visit_id": "V-2025-081163"
  }
}
```
