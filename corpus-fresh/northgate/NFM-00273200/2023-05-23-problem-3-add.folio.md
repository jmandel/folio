---
folio: "0.1"
id: "01H14KT5C0J4Y67DZX5TT4AZH1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273200"
effective: "2023-05-23"
recorded: "2023-05-23T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 2020 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11506",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "visit_id": "V-2023-052373"
  }
}
```
