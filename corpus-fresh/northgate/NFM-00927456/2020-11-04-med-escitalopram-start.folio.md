---
folio: "0.1"
id: "01EP9V29QG107P46QM71HPYQZY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2020-11-04T08:37:00-06:00"
recorded: "2020-11-04T08:37:42-06:00"
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
    "med_id": "ML-47842",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2020-110498"
  }
}
```
