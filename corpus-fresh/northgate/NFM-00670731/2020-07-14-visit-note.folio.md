---
folio: "0.1"
id: "01ED7X9T303YH7Y9V7WFE55JDR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2020-07-14T15:15:00-05:00"
recorded: "2020-07-14T19:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt, problem list entered.
BP 145/86, repeat 140/83. Pulse 76, wt 221 lb.
Labs today: eGFR 62, K 4.5, UACR 213 mg/g, A1c 6%, LDL 124 mg/dL.
Discussed results with pt. Will recheck BP and labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071424",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071424",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
