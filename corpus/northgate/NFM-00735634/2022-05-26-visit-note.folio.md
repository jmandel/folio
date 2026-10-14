---
folio: "0.1"
id: "01G41DP440TX7D8NH5KJ47VFWV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2022-05-26T15:20:00-05:00"
recorded: "2022-05-26T19:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 134/78, pulse 71, wt 205 lb.

Labs 5/22: eGFR 44, K 4.4, UACR 155 mg/g, A1c 8.2%, LDL 59 mg/dL.

A1c up, metformin dose changed to 1000 mg twice daily today. Diet and activity reviewed.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052665",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052665",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-052665",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-052665",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
