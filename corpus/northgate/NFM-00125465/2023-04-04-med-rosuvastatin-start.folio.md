---
folio: "0.1"
id: "01GX6ZRVWGHDVZDTW414Z0YS3R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00125465"
effective: "2023-04-04T15:36:00-05:00"
recorded: "2023-04-04T15:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-10713",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "rosuvastatin 20 MG Oral Tablet", "rxnorm": "859751" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2023-040416"
  }
}
```
