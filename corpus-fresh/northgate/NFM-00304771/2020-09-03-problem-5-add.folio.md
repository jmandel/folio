---
folio: "0.1"
id: "01EHATPFG0QQV4V0TGC0MSMAJQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2020-09-03"
recorded: "2020-09-03T15:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 2017 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19077",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2020-090395"
  }
}
```
