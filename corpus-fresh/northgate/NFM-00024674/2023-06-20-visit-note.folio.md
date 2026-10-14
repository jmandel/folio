---
folio: "0.1"
id: "01H3CXGVN0581RN0R35T3FH9JH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2023-06-20T10:50:00-05:00"
recorded: "2023-06-20T12:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 127/77, pulse 71, wt 175 lb.
Labs today: eGFR 73, K 4.3, A1c 7.9%, LDL 104 mg/dL.
LDL up from last check, reviewed diet with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062023",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062023",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-062023",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
