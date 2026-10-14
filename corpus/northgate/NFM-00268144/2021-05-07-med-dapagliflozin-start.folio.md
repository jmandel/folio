---
folio: "0.1"
id: "01F53P4SXGMH75QJXQPE0BRX2G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2021-05-07T10:11:00-05:00"
recorded: "2021-05-07T10:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: A1c 8.6, CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25739",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.6, CKD",
    "visit_id": "V-2021-050782"
  }
}
```
