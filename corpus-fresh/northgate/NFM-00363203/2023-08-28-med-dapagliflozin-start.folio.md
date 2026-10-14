---
folio: "0.1"
id: "01H8Y76HBGQD9PJ8608ZJJ5PBX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2023-08-28T09:01:00-05:00"
recorded: "2023-08-28T09:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c above goal. Dapagliflozin 10 mg daily started today.</ref> Pt informed at visit.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-17894",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c above goal",
    "visit_id": "V-2023-082891"
  }
}
```
