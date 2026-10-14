---
folio: "0.1"
id: "01D3S21JSG6CSNPJ510EKR1ZD0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2019-02-15T11:07:00-06:00"
recorded: "2019-02-15T11:07:42-06:00"
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
    "med_id": "ML-28287",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 40 MG Oral Tablet", "rxnorm": "617311" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2019-021581"
  }
}
```
