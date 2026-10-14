---
folio: "0.1"
id: "01GHA18C00Z8DVHB22ZAHBR0ME"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00115077"
effective: "2022-11-07"
recorded: "2022-11-07T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13270",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2022-110738"
  }
}
```
