---
folio: "0.1"
id: "01GKAEX8T04BNP3VJ4GGJ02C7W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2022-12-02"
recorded: "2022-12-02T16:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16927",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2022-120243"
  }
}
```
