---
folio: "0.1"
id: "01HE6BD99GQN7AEGV0955TYYB7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00455898"
effective: "2023-11-01T16:07:00-05:00"
recorded: "2023-11-01T16:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: K 6.3 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30313",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.3 confirmed on repeat",
    "review_on": "2023-11-15",
    "visit_id": "V-2023-110175"
  }
}
```
