---
folio: "0.1"
id: "01G9Z6NEK0FCZ55AJVAV1M1AQJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2022-08-08T10:00:00-05:00"
recorded: "2022-08-08T12:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 139/80, pulse 69, wt 149 lb.
Labs 8/6: eGFR 56, K 4.5, UACR 22 mg/g, A1c 7.7%.
Discussed diet, activity and A1c trend.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-080834",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-080834",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-080834",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
