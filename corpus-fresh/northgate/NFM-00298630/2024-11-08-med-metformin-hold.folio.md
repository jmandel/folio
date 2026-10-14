---
folio: "0.1"
id: "01JC6852KGYGRTQZ6M93QAZS0C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2024-11-08T10:01:00-06:00"
recorded: "2024-11-08T10:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin held today, vomiting and poor oral intake. Review 11/15.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32539",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-11-15"
  }
}
```
