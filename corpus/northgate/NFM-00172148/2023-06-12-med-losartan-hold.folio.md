---
folio: "0.1"
id: "01H2RKN0VGPQ4KZXKGTN3HPD85"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2023-06-12T15:09:00-05:00"
recorded: "2023-06-12T15:09:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: K 5.7 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-42520",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.7 confirmed on repeat",
    "review_on": "2023-06-26",
    "visit_id": "V-2023-061262"
  }
}
```
