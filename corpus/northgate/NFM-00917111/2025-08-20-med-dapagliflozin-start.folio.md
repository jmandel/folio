---
folio: "0.1"
id: "01K33WJ6BGX7MRRT9HX9AQQ7CN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2025-08-20T09:01:00-05:00"
recorded: "2025-08-20T09:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: A1c 8.2.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43680",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2025-082065"
  }
}
```
