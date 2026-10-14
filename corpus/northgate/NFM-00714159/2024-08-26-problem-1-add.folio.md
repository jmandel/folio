---
folio: "0.1"
id: "01J686S4E0470H6PQ53SJ5YST6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00714159"
effective: "2024-08-26"
recorded: "2024-08-26T15:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HTN added at first visit, onset 4/2022 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10297",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2022-04-22", "precision": "day" },
    "visit_id": "V-2024-082611"
  }
}
```
