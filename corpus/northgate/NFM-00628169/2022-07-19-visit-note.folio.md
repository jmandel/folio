---
folio: "0.1"
id: "01G8CDTTF0SXNBWXY9ZB157S5P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2022-07-19T13:30:00-05:00"
recorded: "2022-07-19T18:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK.
BP 122/73, pulse 72, wt 190 lb.
Labs 7/14: eGFR 46, K 4, A1c 7.7%, LDL 97.
Metformin dose changed to 500 mg twice daily today (eGFR 45). Nephrology referral sent.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071945",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071945",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-071945",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
