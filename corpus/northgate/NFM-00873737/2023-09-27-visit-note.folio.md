---
folio: "0.1"
id: "01HBBY81P067QD270QA1Y9NRKB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2023-09-27T09:00:00-05:00"
recorded: "2023-09-27T13:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 137/78, pulse 74, wt 192 lb.
Labs today: eGFR 59, K 4.5, UACR 927 mg/g, A1c 6.8%.
eGFR 59 on 6/20 as well, so CKD stage 3a added to problem list. Explained to pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092776",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092776",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092776",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
