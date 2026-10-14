---
folio: "0.1"
id: "01GMR4RGBG7FWFKNBJ6ES7FE42"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759989"
effective: "2022-12-20T10:09:00-06:00"
recorded: "2022-12-20T10:09:42-06:00"
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
    "med_id": "ML-37836",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "levothyroxine sodium 0.075 MG Oral Tablet", "rxnorm": "966222" },
    "dose": { "value": 75, "unit": "mcg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2022-122053"
  }
}
```
