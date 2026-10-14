---
folio: "0.1"
id: "01J3RBJTYGEZT2XPX0AWQEK6RZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2024-07-26T15:26:00-05:00"
recorded: "2024-07-26T15:26:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril held today, K 6.3 confirmed on repeat.</ref> Review 8/9.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24017",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.3 confirmed on repeat",
    "review_on": "2024-08-09",
    "visit_id": "V-2024-072696"
  }
}
```
