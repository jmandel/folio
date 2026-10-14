---
folio: "0.1"
id: "01DE83VNF0X2KA6C0JKWAD46HS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2019-06-25T10:40:00-05:00"
recorded: "2019-06-25T15:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 137/83, pulse 77, wt 170 lb.
Labs today: eGFR 67, K 4.7, A1c 6.7%, LDL 76.
Problem list entered from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-062549",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-062549",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
