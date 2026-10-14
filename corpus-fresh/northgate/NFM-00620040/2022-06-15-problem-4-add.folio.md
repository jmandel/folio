---
folio: "0.1"
id: "01G5KVK0V03E9SGG85QPGSX8MS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2022-06-15"
recorded: "2022-06-15T09:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction, onset 9/10/2017.</ref> Added at first visit, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10570",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2017-09-10", "precision": "day" },
    "visit_id": "V-2022-061593"
  }
}
```
