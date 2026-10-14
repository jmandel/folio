---
folio: "0.1"
id: "01G9FS7Q3GD3AY16F0Q4RYCX7G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2022-08-02T12:21:00-05:00"
recorded: "2022-08-02T12:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dapagliflozin 10 mg daily started, A1c above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-37158",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c above goal",
    "visit_id": "V-2022-080251"
  }
}
```
