---
folio: "0.1"
id: "01G63HZ4CGB5H5MAQBQVBFBBJ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493571"
effective: "2022-06-21T11:36:00-05:00"
recorded: "2022-06-21T11:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2 with CKD. Dapagliflozin 10 mg daily started.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-29121",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.2, CKD",
    "visit_id": "V-2022-062134"
  }
}
```
