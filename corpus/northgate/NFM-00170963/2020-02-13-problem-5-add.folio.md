---
folio: "0.1"
id: "01E108K200QCDCH71A41JQ683A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00170963"
effective: "2020-02-13"
recorded: "2020-02-13T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18774",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2012-03-21", "precision": "day" },
    "visit_id": "V-2020-021388"
  }
}
```
