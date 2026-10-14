---
folio: "0.1"
id: "01DAYYE620VP2TE9RPB9NTYBVZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297636"
effective: "2019-05-15T14:15:00-05:00"
recorded: "2019-05-15T18:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 117/67, pulse 76, wt 197 lb.
Labs from 5/13: eGFR 75, K 4.4, A1c 7.1%, LDL 142.

Records to be requested. RTC for f/u after review.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-051564",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-051564",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
