---
folio: "0.1"
id: "01ED4K56P06N6H1VXTPJN1ASRR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337592"
effective: "2020-07-13"
recorded: "2020-07-13T12:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN since ~2013, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13458",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2020-071322"
  }
}
```
