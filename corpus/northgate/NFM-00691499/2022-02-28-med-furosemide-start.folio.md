---
folio: "0.1"
id: "01FX0Z638GD4RGGK9FN9BWZGCB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00691499"
effective: "2022-02-28T14:08:00-06:00"
recorded: "2022-02-28T14:08:42-06:00"
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
    "med_id": "ML-42520",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "furosemide 40 MG Oral Tablet", "rxnorm": "313988" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2022-022814"
  }
}
```
