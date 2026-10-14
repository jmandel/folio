---
folio: "0.1"
id: "01JB0237WGNWRE7KGKV2T1BDDG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634174"
effective: "2024-10-24T15:04:00-05:00"
recorded: "2024-10-24T15:04:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril 10 mg held today, K 5.7 confirmed on repeat.</ref> Review 11/7.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-15067",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.7 confirmed on repeat",
    "review_on": "2024-11-07",
    "visit_id": "V-2024-102445"
  }
}
```
