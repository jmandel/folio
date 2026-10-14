---
folio: "0.1"
id: "01ERJ5K5X0NVNS48RVEFM8ZBK3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00933357"
effective: "2020-12-02"
recorded: "2020-12-02T10:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 11/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19640",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2017-11-01", "precision": "month" },
    "visit_id": "V-2020-120221"
  }
}
```
