---
folio: "0.1"
id: "01HBSBJEK0185Z39JVDAFDJSFX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2023-10-02T13:20:00-05:00"
recorded: "2023-10-02T18:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 124/73, pulse 68, wt 199 lb.
Labs today: eGFR 50, K 3.9, UACR 97 mg/g, A1c 7.9%.
A1c better than last visit. Pt doing well with home checks.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100256",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100256",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-100256",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
