---
folio: "0.1"
id: "01D3HE65T0WW5A0MMFSD1XZPTA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00719869"
effective: "2019-02-12T09:10:00-06:00"
recorded: "2019-02-12T12:06:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 121/78, pulse 62, wt 161 lb.
Labs today: eGFR 55, K 4.3, UACR 406 mg/g, A1c 7.5%, LDL 54.
Reviewed results with pt. Will recheck kidney labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-021214",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-021214",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
