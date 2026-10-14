---
folio: "0.1"
id: "01EWZH4N7GV1Q4DAG5048NSG6K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00254529"
effective: "2021-01-26T08:21:00-06:00"
recorded: "2021-01-26T08:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin 10 mg daily started today. A1c 8.1, CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-37371",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.1, CKD",
    "visit_id": "V-2021-012661"
  }
}
```
