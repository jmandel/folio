---
folio: "0.1"
id: "01D8KY8RM03ZGKW7MVTSZFCHYP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2019-04-16T10:00:00-05:00"
recorded: "2019-04-16T15:44:00-05:00"
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
BP 143/74, repeat 138/72. Pulse 72, wt 223 lb.
Labs today: eGFR 73, K 4.2, A1c 6.8%, LDL 162 mg/dL.
Discussed BP, sugars and weight. Pt agreeable to plan.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-041657",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-041657",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-041657",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
