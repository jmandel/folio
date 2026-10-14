---
folio: "0.1"
id: "01G3EZGM6075M267Z9Y7XZ92HQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2022-05-19T12:50:00-05:00"
recorded: "2022-05-19T15:18:00-05:00"
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
BP 145/88, repeat 138/85. Pulse 80, wt 201 lb.
Labs from 5/16: eGFR 92, K 4.2, UACR 155 mg/g, A1c 5.8%.
Records to be requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051923",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051923",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-051923",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
