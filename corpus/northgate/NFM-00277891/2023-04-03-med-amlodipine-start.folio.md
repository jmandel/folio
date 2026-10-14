---
folio: "0.1"
id: "01GX3ZZNYGGV9Q940XTTHTCQ2W"
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
<ref id="med_1">Amlodipine 10 mg daily started, replacing lisinopril (angioedema).</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-42659",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 10 MG Oral Tablet", "rxnorm": "308135" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "replacing lisinopril (angioedema)",
    "visit_id": "V-2023-040373"
  }
}
```
