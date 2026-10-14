---
folio: "0.1"
id: "01J01A9VTGCMCZF2BXA15HJ15X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2024-06-10T09:54:00-05:00"
recorded: "2024-06-10T09:54:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Vomiting, poor oral intake. Metformin held today, review 6/17.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-45006",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-06-17"
  }
}
```
