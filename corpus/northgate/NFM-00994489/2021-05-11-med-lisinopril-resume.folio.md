---
folio: "0.1"
id: "01F5EENJWG6TJXTQ1Y3PGXH84G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-05-11T14:32:00-05:00"
recorded: "2021-05-11T14:32:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Eating and drinking normally. Lisinopril resumed today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38604",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "eating and drinking normally"
  }
}
```
