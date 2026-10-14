---
folio: "0.1"
id: "01E9V660X0D5YFRK6Q53G6C8HH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2020-06-02T10:50:00-05:00"
recorded: "2020-06-02T13:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headaches or dizziness.
BP 134/75, pulse 77, wt 251 lb.
Labs 5/27: eGFR 63, K 4.7, UACR 182 mg/g.
Reviewed labs with pt, will keep watching trend.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-060243",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-060243",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
