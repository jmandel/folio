---
folio: "0.1"
id: "01DPP0BGYGNA9EK7BVV7QH2MG4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00674394"
effective: "2019-10-08T10:38:00-05:00"
recorded: "2019-10-08T10:38:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-44632",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2019-100895"
  }
}
```
