---
folio: "0.1"
id: "01HYXXRBA0136P92SWZTEX8M1F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2024-05-27"
recorded: "2024-05-27T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 8/2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19824",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-08-01", "precision": "month" },
    "visit_id": "V-2024-052795"
  }
}
```
