---
folio: "0.1"
id: "01HD4F89GGQ5265Y7Q8BCKC5JY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2023-10-19T12:20:00-05:00"
recorded: "2023-10-19T12:20:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">resume metformin: eating and drinking normally.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-29705",
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
