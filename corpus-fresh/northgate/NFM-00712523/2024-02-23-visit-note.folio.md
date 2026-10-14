---
folio: "0.1"
id: "01HQBZ8B00C0WYS5DBG4JAAYGY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-02-23T10:10:00-06:00"
recorded: "2024-02-23T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 137/76, pulse 71, wt 175 lb.
Labs from 2/17: eGFR 45, K 4.9, UACR 48 mg/g, A1c 7.8%, LDL 73.
Reviewed results with pt, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022375",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-022375",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-022375",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
