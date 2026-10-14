---
folio: "0.1"
id: "01J0S1BBG0XR5RZX9QEZW8V5C2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00135456"
effective: "2024-06-19T11:50:00-05:00"
recorded: "2024-06-19T15:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN and DM2 per pt.
BP 138/86, pulse 67, wt 180 lb.
Labs 6/14: eGFR 88, K 4.4, A1c 8%, LDL 140 mg/dL.
Problem list entered today. Reviewed labs with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061913",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061913",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-061913",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
