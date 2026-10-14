---
folio: "0.1"
id: "01HMCE414GG0ZYFVCE2FSM8RRR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2024-01-17T13:24:00-06:00"
recorded: "2024-01-17T13:24:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Vomiting and poor oral intake. Metformin held today.</ref> Review 1/24.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23374",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-01-24"
  }
}
```
