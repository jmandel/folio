---
folio: "0.1"
id: "01FBSWJV7GAWTR9DRGVPVNMF21"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2021-07-29T14:41:00-05:00"
recorded: "2021-07-29T14:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin 10 mg daily started today for CKD + DM, cardiorenal benefit.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38187",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "CKD + DM, cardiorenal benefit",
    "visit_id": "V-2021-072937"
  }
}
```
