---
folio: "0.1"
id: "01E1CKDAW0EH207X4SRQ8H0W01"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00481225"
effective: "2020-02-18"
recorded: "2020-02-18T10:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2017.</ref> History per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13393",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2020-021857"
  }
}
```
