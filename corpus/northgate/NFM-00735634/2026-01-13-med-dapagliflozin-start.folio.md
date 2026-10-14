---
folio: "0.1"
id: "01KEWCX2BGGCRXR00HE95WEFES"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2026-01-13T13:21:00-06:00"
recorded: "2026-01-13T13:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: A1c 8.3, CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27952",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3, CKD",
    "visit_id": "V-2026-011382"
  }
}
```
