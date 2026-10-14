---
folio: "0.1"
id: "01H0GZ0PN0FS9BJDQH76NS2WTQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2023-05-15T14:15:00-05:00"
recorded: "2023-05-15T19:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 136/85, pulse 74, wt 174 lb.
Labs today: eGFR 50, K 4.4, UACR 11 mg/g, A1c 8.5%.
A1c up. Insulin glargine started today, 10 units at bedtime. Reviewed pen use and low sugar symptoms.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051521",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051521",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-051521",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
