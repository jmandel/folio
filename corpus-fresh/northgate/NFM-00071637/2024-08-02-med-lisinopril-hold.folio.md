---
folio: "0.1"
id: "01J4AB92NGT6TMM8NXY5RQ6D6J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2024-08-02T15:07:00-05:00"
recorded: "2024-08-02T15:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.1, confirmed on repeat. Lisinopril held today.</ref> Review 8/16.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-12678",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.1 confirmed on repeat",
    "review_on": "2024-08-16",
    "visit_id": "V-2024-080249"
  }
}
```
