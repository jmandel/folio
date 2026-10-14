---
folio: "0.1"
id: "01D2BF3QH0ZEY70EWG98Y8M4NT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2019-01-28T13:15:00-06:00"
recorded: "2019-01-28T18:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx per pt.
BP 133/85, pulse 66, wt 148 lb.
Labs 1/25: eGFR 93, K 4.4, A1c 8.6%, LDL 99.
Dulaglutide started 0.5 mg weekly today for A1c 8.6.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-012891",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-012891",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
