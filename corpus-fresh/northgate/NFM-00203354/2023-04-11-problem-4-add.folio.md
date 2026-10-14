---
folio: "0.1"
id: "01GXRBP3R0B52R7XDTWBYHYEH1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00203354"
effective: "2023-04-11"
recorded: "2023-04-11T09:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Recurrent mild major depressive disorder, onset 2023.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13007",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2023-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2023-041189"
  }
}
```
