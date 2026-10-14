---
folio: "0.1"
id: "01H5T47Z60V09WTFPBZ1EGHY59"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2023-07-20T08:15:00-05:00"
recorded: "2023-07-20T12:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 124/78, pulse 73, wt 202 lb.
Labs 7/16: eGFR 93, K 4.7, UACR 10 mg/g, A1c 7.1%.
Reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072017",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072017",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-072017",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-072017",
    "rank": 3,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
