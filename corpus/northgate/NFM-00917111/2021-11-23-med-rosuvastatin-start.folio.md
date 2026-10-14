---
folio: "0.1"
id: "01FN6TNP5G3MRKQ6P8J1GR45ZS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2021-11-23T10:39:00-06:00"
recorded: "2021-11-23T10:39:42-06:00"
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
    "med_id": "ML-45811",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "rosuvastatin 20 MG Oral Tablet", "rxnorm": "859751" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2021-112313"
  }
}
```
