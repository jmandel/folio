---
folio: "0.1"
id: "01F5XK8SBG2X802ZFDW3CY20CM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2021-05-17T11:41:00-05:00"
recorded: "2021-05-17T11:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dapagliflozin 10 mg daily started today for A1c 8.3 and CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16984",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3, CKD",
    "visit_id": "V-2021-051789"
  }
}
```
