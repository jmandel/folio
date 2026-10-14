---
folio: "0.1"
id: "01GMEXEZK06QQMDSF03TY1MV1D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2022-12-16T15:40:00-06:00"
recorded: "2022-12-16T20:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM follow-up. BP 140/84, pulse 77, wt 182 lb.
Labs today: eGFR 51, K 4.7, A1c 9%.
A1c 9, so dulaglutide started 0.5 mg weekly today. Injection technique reviewed.
BP above goal, lisinopril changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121676",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121676",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121676",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-121676",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
