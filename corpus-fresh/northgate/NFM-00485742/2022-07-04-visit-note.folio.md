---
folio: "0.1"
id: "01G75N0D00CVQ1RAT7SY2ZXG88"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2022-07-04T12:40:00-05:00"
recorded: "2022-07-04T17:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing OK, no new complaints.
BP 142/82, pulse 76, wt 229 lb.
eGFR 52, K 4.8, A1c 8.3% today.
Started dapagliflozin 10 mg daily today (A1c 8.3, CKD). Lisinopril dose changed to 20 mg daily today (BP above goal).
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-070491",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-070491",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-070491",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
