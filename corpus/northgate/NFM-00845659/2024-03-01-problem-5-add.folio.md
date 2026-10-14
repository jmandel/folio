---
folio: "0.1"
id: "01HQXTKDK0D01HW3E2B2ZXAVVT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00845659"
effective: "2024-03-01"
recorded: "2024-03-01T14:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2023 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11855",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2023-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2024-030186"
  }
}
```
