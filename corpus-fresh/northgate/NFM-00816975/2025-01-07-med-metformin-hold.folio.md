---
folio: "0.1"
id: "01JH18K6SGM3Q6S0RGE3H08ANF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2025-01-07T14:51:00-06:00"
recorded: "2025-01-07T14:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin held today for vomiting and poor oral intake.</ref> Review 1/14.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-34690",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2025-01-14"
  }
}
```
