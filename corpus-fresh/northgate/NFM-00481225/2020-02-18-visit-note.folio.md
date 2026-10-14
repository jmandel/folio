---
folio: "0.1"
id: "01E1D60DV00KBD3V7FMW63687B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00481225"
effective: "2020-02-18T10:20:00-06:00"
recorded: "2020-02-18T16:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records to be requested from prior office.

BP 139/93, pulse 74, wt 221 lb.

History reviewed with pt and problem list started today.

Discussed diet and activity. Pt agrees to f/u.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021857",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021857",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
