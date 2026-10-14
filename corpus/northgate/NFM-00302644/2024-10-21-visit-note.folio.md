---
folio: "0.1"
id: "01JARVQZ10MWG1EE3M39MWQEF5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00302644"
effective: "2024-10-21T15:00:00-05:00"
recorded: "2024-10-21T19:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no new complaints.
BP 135/82, pulse 74, wt 207 lb.
eGFR 77, K 4.8, A1c 7.8%, LDL 87 mg/dL.
Labs reviewed with pt. Continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102148",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102148",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-102148",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
