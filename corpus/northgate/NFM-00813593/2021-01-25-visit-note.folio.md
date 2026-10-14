---
folio: "0.1"
id: "01EWY4JT90WF5CTZN45K3F9SHW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2021-01-25T15:30:00-06:00"
recorded: "2021-01-25T19:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no hypoglycemia sx.
BP 139/84, pulse 72, wt 225 lb.
eGFR 71, K 4.6, A1c 6.6% today.
Continue current plan. Reviewed diet.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-012552",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-012552",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
