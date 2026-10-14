---
folio: "0.1"
id: "01J5RDD8E0XV4XHXHAKQ09KR8C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225756"
effective: "2024-08-20T08:50:00-05:00"
recorded: "2024-08-20T12:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.

BP 152/88, repeat 150/84, pulse 88, wt 212 lb.
Labs today: eGFR 78, K 4.6, A1c 6.1%, LDL 157 mg/dL, UACR 417 mg/g.

BP still above goal, lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082053",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082053",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082053",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
