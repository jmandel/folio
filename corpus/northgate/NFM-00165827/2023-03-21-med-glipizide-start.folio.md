---
folio: "0.1"
id: "01GW2CT5CGRWCFAN4Q92QAH2ZZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165827"
effective: "2023-03-21T10:32:00-05:00"
recorded: "2023-03-21T10:32:42-05:00"
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
    "med_id": "ML-41086",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "glipizide 5 MG Oral Tablet", "rxnorm": "310490" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2023-032193"
  }
}
```
