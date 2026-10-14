---
folio: "0.1"
id: "01DHKTZB5G4D087CMC6QHVYJ98"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2019-08-06T11:07:00-05:00"
recorded: "2019-08-06T11:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: A1c 9.2, CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-41882",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 9.2, CKD",
    "visit_id": "V-2019-080672"
  }
}
```
