---
folio: "0.1"
id: "01K2G3FD3G4N1Y9AZNTBJX6XQZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2025-08-12T16:37:00-05:00"
recorded: "2025-08-12T16:37:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.6 confirmed on repeat. Losartan held today.</ref> Review 8/26.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39820",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2025-08-26",
    "visit_id": "V-2025-081296"
  }
}
```
