---
folio: "0.1"
id: "01DT04GTS03ENRTS25QZXQZSSA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2019-11-18T10:15:00-06:00"
recorded: "2019-11-18T14:51:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 127/76, pulse 85, wt 170 lb.
Labs from 11/14: eGFR 72, K 3.9.

Records requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-111855",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-111855",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
