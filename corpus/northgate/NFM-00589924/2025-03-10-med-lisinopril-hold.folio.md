---
folio: "0.1"
id: "01JP0XXQXGR3EM2KJ3BZARBVA0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2025-03-10T16:03:00-05:00"
recorded: "2025-03-10T16:03:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: K 5.9 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-20925",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.9 confirmed on repeat",
    "review_on": "2025-03-24",
    "visit_id": "V-2025-031049"
  }
}
```
