---
folio: "0.1"
id: "01JFGRAX40FDXZGC0Z8EZTMBGE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00657531"
effective: "2024-12-19T13:15:00-06:00"
recorded: "2024-12-19T18:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 145/81, pulse 80, wt 252 lb.
Labs today: eGFR 59, K 4.3, UACR 14 mg/g, A1c 8%, LDL 78 mg/dL.
Problem list entered from pt history.
RTC to review results and BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121996",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121996",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-121996",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-121996",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
