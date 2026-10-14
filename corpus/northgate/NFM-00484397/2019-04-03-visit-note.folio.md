---
folio: "0.1"
id: "01D7HTX210Q43S5VN5DHDBTBQD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2019-04-03T08:10:00-05:00"
recorded: "2019-04-03T09:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 127/76, pulse 66, wt 160 lb.
Labs 3/28: eGFR 84, K 4.3, LDL 102 mg/dL.
Discussed diet and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-040393",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-040393",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
