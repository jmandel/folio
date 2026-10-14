---
folio: "0.1"
id: "01FT9FVSD0QRT5Z38K4CQ6XWTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00884935"
effective: "2022-01-25"
recorded: "2022-01-25T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12669",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-06-27", "precision": "day" },
    "visit_id": "V-2022-012599"
  }
}
```
