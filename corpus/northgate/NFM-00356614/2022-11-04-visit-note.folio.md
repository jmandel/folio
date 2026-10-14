---
folio: "0.1"
id: "01GH2BNFM0YNV79ZG63VVABTT2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2022-11-04T12:45:00-05:00"
recorded: "2022-11-04T17:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new concerns.
BP 132/76, pulse 67, wt 233 lb.
Labs 11/1: eGFR 58, K 4.5, UACR 234 mg/g, A1c 8%.
A1c a bit up. Reviewed diet with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110431",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110431",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-110431",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
