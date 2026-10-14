---
folio: "0.1"
id: "01DFE9S9DGQQ5Z8K5R7E5284W6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00448962"
effective: "2019-07-10T10:59:00-05:00"
recorded: "2019-07-10T10:59:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-47933",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "furosemide 40 MG Oral Tablet", "rxnorm": "313988" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2019-071025"
  }
}
```
