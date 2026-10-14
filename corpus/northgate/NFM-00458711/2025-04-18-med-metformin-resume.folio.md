---
folio: "0.1"
id: "01JS57K34GZ2B8ZJXQ6BP0EFSZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2025-04-18T14:56:00-05:00"
recorded: "2025-04-18T14:56:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Eating and drinking normally. Metformin resumed today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18057",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eating and drinking normally"
  }
}
```
