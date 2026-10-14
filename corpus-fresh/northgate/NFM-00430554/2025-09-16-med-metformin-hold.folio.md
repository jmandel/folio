---
folio: "0.1"
id: "01K59H2EHG9A7K75E8BJRF122H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00430554"
effective: "2025-09-16T10:07:00-05:00"
recorded: "2025-09-16T10:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin 1000 mg BID held today, vomiting and poor oral intake.</ref> Review 9/23.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32510",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2025-09-23"
  }
}
```
