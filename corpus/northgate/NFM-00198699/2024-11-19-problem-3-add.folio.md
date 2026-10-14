---
folio: "0.1"
id: "01JD36JD00E3F41JG96YDRH3TV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00198699"
effective: "2024-11-19"
recorded: "2024-11-19T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "problem_id": "PL-19970",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-10-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2024-111996"
  }
}
```
