---
folio: "0.1"
id: "01H12M94QGYBD2XWKZT51S6R6K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2023-05-22T16:01:00-05:00"
recorded: "2023-05-22T16:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: K 6.2 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48814",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2023-06-05",
    "visit_id": "V-2023-052277"
  }
}
```
