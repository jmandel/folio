---
folio: "0.1"
id: "01EX4R7WJ0TYV1226DG1QVHNNJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00036899"
effective: "2021-01-28"
recorded: "2021-01-28T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9444",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2021-012885"
  }
}
```
