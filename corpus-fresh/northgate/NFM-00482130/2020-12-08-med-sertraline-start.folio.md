---
folio: "0.1"
id: "01ES2019KGSRHKPTN77T0SG8ZW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2020-12-08T14:17:00-06:00"
recorded: "2020-12-08T14:17:42-06:00"
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
    "med_id": "ML-44768",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 100 MG Oral Tablet", "rxnorm": "312938" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-120821"
  }
}
```
