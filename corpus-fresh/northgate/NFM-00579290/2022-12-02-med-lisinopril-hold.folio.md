---
folio: "0.1"
id: "01GKAD9EKGZTGCX11W8PXKJ1NF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2022-12-02T15:53:00-06:00"
recorded: "2022-12-02T15:53:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.9 confirmed on repeat. Lisinopril held today.</ref> Review 12/16.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13294",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.9 confirmed on repeat",
    "review_on": "2022-12-16",
    "visit_id": "V-2022-120276"
  }
}
```
