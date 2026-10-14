---
folio: "0.1"
id: "01GJKSRA70QSM7JC7QRBTZVKYT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2022-11-23T15:20:00-06:00"
recorded: "2022-11-23T21:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no complaints.

BP 141/81, repeat 138/81, pulse 66, wt 141 lb.
Labs 11/21: eGFR 86, K 4, UACR 194 mg/g, A1c 6.6%, LDL 131.

Results reviewed with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112328",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112328",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
