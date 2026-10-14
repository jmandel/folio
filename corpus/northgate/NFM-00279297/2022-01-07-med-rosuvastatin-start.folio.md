---
folio: "0.1"
id: "01FRV7AH4G4R5Y4KAFGV9ZY0Q0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00279297"
effective: "2022-01-07T15:32:00-06:00"
recorded: "2022-01-07T15:32:42-06:00"
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
    "med_id": "ML-19000",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "rosuvastatin calcium 20 MG Oral Tablet", "rxnorm": "859751" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2022-010761"
  }
}
```
