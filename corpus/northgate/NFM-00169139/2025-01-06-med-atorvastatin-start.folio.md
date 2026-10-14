---
folio: "0.1"
id: "01JGYNQV1GHPWSMA3FSQSMX90X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2025-01-06T14:43:00-06:00"
recorded: "2025-01-06T14:43:42-06:00"
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
    "med_id": "ML-33506",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 80 MG Oral Tablet", "rxnorm": "617314" },
    "dose": { "value": 80, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime"
  }
}
```
