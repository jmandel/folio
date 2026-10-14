---
folio: "0.1"
id: "01E8CBZGR0BPS0SBPC9H9FXBAE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2020-05-15"
recorded: "2020-05-15T09:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, since 2007 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18344",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2020-051516"
  }
}
```
