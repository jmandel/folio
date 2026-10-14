---
folio: "0.1"
id: "01GFPB0JP0RXJQ2Q4ADR2PG1WA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2022-10-18"
recorded: "2022-10-18T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 7/2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16851",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2013-07-01", "precision": "month" },
    "visit_id": "V-2022-101846"
  }
}
```
