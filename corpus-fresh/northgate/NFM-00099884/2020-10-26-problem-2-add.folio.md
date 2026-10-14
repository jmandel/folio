---
folio: "0.1"
id: "01ENJRK8C0C6C70B1RX0HBQN7M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2020-10-26"
recorded: "2020-10-26T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 7/2008 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15890",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2008-07-01", "precision": "month" },
    "visit_id": "V-2020-102617"
  }
}
```
