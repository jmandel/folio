---
folio: "0.1"
id: "01HYXXRBA0BS0CZJSA1K9KZHJ8"
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
<ref id="prob_1">Heart failure with reduced ejection fraction, onset 7/13/2023 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15736",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2023-07-13", "precision": "day" },
    "visit_id": "V-2024-052795"
  }
}
```
