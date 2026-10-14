---
folio: "0.1"
id: "01DKCZZQC0F6KDXJJ5TW1FTV4S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2019-08-28"
recorded: "2019-08-28T15:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11726",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-082891"
  }
}
```
