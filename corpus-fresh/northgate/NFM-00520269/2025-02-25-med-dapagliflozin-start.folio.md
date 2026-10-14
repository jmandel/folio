---
folio: "0.1"
id: "01JMZGZT2GG4DWHGVB4XE6EA03"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2025-02-25T15:42:00-06:00"
recorded: "2025-02-25T15:42:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Start dapagliflozin 10 mg daily for CKD + DM, cardiorenal benefit.</ref> Pt counseled.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26925",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "CKD + DM, cardiorenal benefit",
    "visit_id": "V-2025-022541"
  }
}
```
