---
folio: "0.1"
id: "01H851K3YG854DAZVH9N76GA1N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18T14:22:00-05:00"
recorded: "2023-08-18T14:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3 with CKD. Start dapagliflozin 10 mg daily.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-34487",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3, CKD",
    "visit_id": "V-2023-081873"
  }
}
```
