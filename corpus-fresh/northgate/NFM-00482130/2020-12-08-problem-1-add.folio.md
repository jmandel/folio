---
folio: "0.1"
id: "01ES20VFG0FPST0VFD3STJC5MF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2020-12-08"
recorded: "2020-12-08T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007.</ref> Added at first visit here; history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16182",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2020-120821"
  }
}
```
