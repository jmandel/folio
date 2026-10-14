---
folio: "0.1"
id: "01KP3JPSXGV350G2KGJA2VKG90"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2026-04-13T09:07:00-05:00"
recorded: "2026-04-13T09:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Vomiting and poor oral intake. Metformin held today, review 4/20.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14165",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2026-04-20"
  }
}
```
