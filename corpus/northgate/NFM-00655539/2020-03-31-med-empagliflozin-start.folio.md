---
folio: "0.1"
id: "01E4RQ7GCG3DXFN92AHK1G3B4H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00655539"
effective: "2020-03-31T11:36:00-05:00"
recorded: "2020-03-31T11:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Empagliflozin 10 mg daily started.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-45363",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2020-033136"
  }
}
```
