---
folio: "0.1"
id: "01HKAJ6BQGFFXTG693XM5TG625"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2024-01-04T09:41:00-06:00"
recorded: "2024-01-04T09:41:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: CKD + DM, cardiorenal benefit.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11440",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "CKD + DM, cardiorenal benefit",
    "visit_id": "V-2024-010484"
  }
}
```
