---
folio: "0.1"
id: "01E6PMQMY0J6VEK12ZAE8JF5FA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2020-04-24T10:10:00-05:00"
recorded: "2020-04-24T12:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.
BP 110/66, pulse 70, wt 173 lb.
Labs today: eGFR 67, K 4.7, UACR 187 mg/g, A1c 7.8%.
Problem list built from pt's history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042492",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042492",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-042492",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
