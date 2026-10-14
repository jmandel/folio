---
folio: "0.1"
id: "01FN6TQGRGF21N3DR7EYB0BJYV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2021-11-23T10:40:00-06:00"
recorded: "2021-11-23T10:40:42-06:00"
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
    "med_id": "ML-25311",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "levothyroxine sodium 0.075 MG Oral Tablet", "rxnorm": "966222" },
    "dose": { "value": 75, "unit": "mcg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2021-112313"
  }
}
```
