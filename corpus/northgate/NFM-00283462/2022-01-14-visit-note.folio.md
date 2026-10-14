---
folio: "0.1"
id: "01FSCQ0M606HVAZTC4AQP1Z5G5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283462"
effective: "2022-01-14T08:50:00-06:00"
recorded: "2022-01-14T10:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 140/82, pulse 64, wt 196 lb.

Labs 1/11: eGFR 57, K 4.6, UACR 233 mg/g.

Will recheck BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011494",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011494",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
