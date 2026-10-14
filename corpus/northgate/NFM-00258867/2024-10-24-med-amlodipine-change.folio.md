---
folio: "0.1"
id: "01JAZGDEDG2ZCWXFCVTGDGBCRH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258867"
effective: "2024-10-24T09:55:00-05:00"
recorded: "2024-10-24T09:55:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Amlodipine up to 10 mg daily, replacing lisinopril (angioedema).</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21029",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "amlodipine 10 MG Oral Tablet", "rxnorm": "308135" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "replacing lisinopril (angioedema)",
    "visit_id": "V-2024-102468"
  }
}
```
