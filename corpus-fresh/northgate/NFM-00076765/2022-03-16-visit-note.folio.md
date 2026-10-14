---
folio: "0.1"
id: "01FYA4RGH0XGMVZT84T2WK88ZS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2022-03-16T13:20:00-05:00"
recorded: "2022-03-16T14:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 135/81, pulse 67, wt 154 lb.
eGFR 48, UACR 558 mg/g, A1c 7.4%, LDL 171 mg/dL.
K 6 on first draw was hemolyzed; repeat K 4.1.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031641",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031641",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-031641",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
