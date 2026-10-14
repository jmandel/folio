---
folio: "0.1"
id: "01FTH11P20EG0PCAFXXVMEBW6R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2022-01-28"
recorded: "2022-01-28T13:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 4/2016 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14456",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2016-04-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2022-012886"
  }
}
```
