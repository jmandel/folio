---
folio: "0.1"
id: "01E3JDBHF0WN6TX2BCXDFJW545"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2020-03-16T08:50:00-05:00"
recorded: "2020-03-16T14:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 148/84, pulse 63, wt 164 lb.
Today: eGFR 71, K 4.5, UACR 265 mg/g, A1c 6.7%, LDL 141.
A1c at goal. BP above goal, LDL up. Diet reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-031623",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-031623",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-031623",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
