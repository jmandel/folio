---
folio: "0.1"
id: "01GBXDR3QGV8QN1Y3ZHYQ3CPM1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00345310"
effective: "2022-09-01T16:01:00-05:00"
recorded: "2022-09-01T16:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dapagliflozin 10 mg daily started today for A1c 8.5 and CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-20654",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.5, CKD",
    "visit_id": "V-2022-090195"
  }
}
```
