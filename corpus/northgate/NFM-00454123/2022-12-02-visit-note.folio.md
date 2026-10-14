---
folio: "0.1"
id: "01GKAZCKT0DVAN2VH2RZ1DS2WA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2022-12-02T15:50:00-06:00"
recorded: "2022-12-02T21:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt and problem list entered.

BP 117/68, pulse 63, wt 199 lb.

Labs today: eGFR 96, K 4.7, A1c 6.7%, LDL 78.

Pt doing well, no new complaints. RTC to be scheduled for f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-120243",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-120243",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-120243",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-120243",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-120243",
    "rank": 4,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
