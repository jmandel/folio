---
folio: "0.1"
id: "01HJKM2FG0DEN2S1KGPE8JHXHC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2023-12-26"
recorded: "2023-12-26T11:52:00-06:00"
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
    "problem_id": "PL-9295",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2021-04-24", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2023-122658"
  }
}
```
