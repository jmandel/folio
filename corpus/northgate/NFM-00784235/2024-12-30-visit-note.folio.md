---
folio: "0.1"
id: "01JGCSQAX0QPGZVX52VB1MD5GZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00784235"
effective: "2024-12-30T09:50:00-06:00"
recorded: "2024-12-30T16:07:00-06:00"
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

BP 138/84, pulse 77, wt 204 lb.

Labs from 12/27: eGFR 90, K 4.7, A1c 7.7%, LDL 100.

HTN and DM2 added to problem list per pt history.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-123025",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-123025",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
