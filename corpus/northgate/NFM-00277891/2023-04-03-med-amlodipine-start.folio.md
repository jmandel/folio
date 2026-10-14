---
folio: "0.1"
id: "01GX3ZZNYG3SVW7XBMZYSGDGCP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-04-03T11:42:00-05:00"
recorded: "2023-04-03T11:42:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start amlodipine: replacing lisinopril (angioedema).</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-35129",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "replacing lisinopril (angioedema)",
    "visit_id": "V-2023-040311"
  }
}
```
