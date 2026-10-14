---
folio: "0.1"
id: "01ENNN9J804Y9QD52HS1Y9RZGB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899400"
effective: "2020-10-27"
recorded: "2020-10-27T13:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 2018 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11358",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2020-102754"
  }
}
```
