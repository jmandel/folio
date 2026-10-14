---
folio: "0.1"
id: "01GP4HYDAGBFC5Z2JYYPM42A2Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-01-06T16:06:00-06:00"
recorded: "2023-01-06T16:06:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: A1c 8.4, CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-47824",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.4, CKD",
    "visit_id": "V-2023-010627"
  }
}
```
