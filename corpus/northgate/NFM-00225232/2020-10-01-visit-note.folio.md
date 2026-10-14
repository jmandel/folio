---
folio: "0.1"
id: "01EKJF26A0X0YTNE9N4FX6PMWP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225232"
effective: "2020-10-01T08:20:00-05:00"
recorded: "2020-10-01T11:14:00-05:00"
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
BP 133/81, pulse 84, wt 180 lb.
Labs today: eGFR 93, K 4.3, UACR 173 mg/g, A1c 7.7%, LDL 126 mg/dL.
Discussed labs with pt, esp. urine albumin and A1c.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100122",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100122",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
