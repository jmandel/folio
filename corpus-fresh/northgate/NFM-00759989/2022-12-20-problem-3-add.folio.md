---
folio: "0.1"
id: "01GMR5F1204TBJSNGRV09YG00G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759989"
effective: "2022-12-20"
recorded: "2022-12-20T10:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity since ~5/2007 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14511",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2007-05-01", "precision": "month" },
    "visit_id": "V-2022-122053"
  }
}
```
