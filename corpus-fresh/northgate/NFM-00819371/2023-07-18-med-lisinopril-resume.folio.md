---
folio: "0.1"
id: "01H5NBAV3GBEHSGEHVKMNM8KZZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2023-07-18T15:33:00-05:00"
recorded: "2023-07-18T15:33:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Eating and drinking normally. Lisinopril resumed today.</ref> Pt informed by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-34293",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "eating and drinking normally"
  }
}
```
