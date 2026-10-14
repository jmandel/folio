---
folio: "0.1"
id: "01D6YB6J50WAPF3E0QX4PGRD74"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2019-03-26T14:10:00-05:00"
recorded: "2019-03-26T20:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and knee OA, all per pt.
BP 123/75, pulse 72, wt 186 lb.
Labs 3/21: eGFR 65, K 4.2, UACR 10 mg/g, A1c 7.7%.
Problem list entered from pt's history. Will request old records.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-032617",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-032617",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-032617",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
