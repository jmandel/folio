---
folio: "0.1"
id: "01GCVN4F801DEZMK6KJSGD99WQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2022-09-13T08:15:00-05:00"
recorded: "2022-09-13T09:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 137/82, pulse 64, wt 183 lb.
9/8 labs: eGFR 71, K 4.5, A1c 8.2%, LDL 92.
A1c 8.2, semaglutide started 0.5 mg weekly today. Injection technique reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091399",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091399",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091399",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
