---
folio: "0.1"
id: "01GYBMBCK0FPKF1RTMEE7S2P7K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2023-04-18T14:50:00-05:00"
recorded: "2023-04-18T21:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c not at goal.
BP 123/79, pulse 73, wt 237 lb.
eGFR 55, K 4.7, A1c 8.2% today.
Insulin glargine started 10 units at bedtime today (A1c 8.2). Teaching done on pen use.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041848",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041848",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-041848",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
