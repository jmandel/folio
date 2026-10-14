---
folio: "0.1"
id: "01DZ1NP3CG3FT2VCKJ2Z1HDVBM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00530802"
effective: "2020-01-20T08:28:00-06:00"
recorded: "2020-01-20T08:28:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "med_id": "ML-18093",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "rosuvastatin 20 MG Oral Tablet", "rxnorm": "859751" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2020-012024"
  }
}
```
