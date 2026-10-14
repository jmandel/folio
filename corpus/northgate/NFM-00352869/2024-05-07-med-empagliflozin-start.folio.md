---
folio: "0.1"
id: "01HX9ZFN9G0Z3Q6E4K8K81E2XR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00352869"
effective: "2024-05-07T11:51:00-05:00"
recorded: "2024-05-07T11:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin 10 mg daily started for A1c 8.4 and CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33629",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.4, CKD",
    "visit_id": "V-2024-050741"
  }
}
```
