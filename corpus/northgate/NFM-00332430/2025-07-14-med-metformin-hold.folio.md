---
folio: "0.1"
id: "01K04W8RMG66GGPR0KE4XZY6WQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00332430"
effective: "2025-07-14T11:28:00-05:00"
recorded: "2025-07-14T11:28:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold metformin: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-35593",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2025-07-21"
  }
}
```
