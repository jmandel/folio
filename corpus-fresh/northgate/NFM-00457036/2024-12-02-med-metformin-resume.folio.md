---
folio: "0.1"
id: "01JE437RMG65XQMAHEH8C159RA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2024-12-02T10:28:00-06:00"
recorded: "2024-12-02T10:28:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "med_id": "ML-19020",
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
