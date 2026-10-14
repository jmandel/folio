---
folio: "0.1"
id: "01J2YJD6FG1NNM92FVD29THVDQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2024-07-16T15:05:00-05:00"
recorded: "2024-07-16T15:05:42-05:00"
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
    "med_id": "ML-33925",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 10 MG Oral Tablet", "rxnorm": "308135" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily"
  }
}
```
