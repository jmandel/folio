---
folio: "0.1"
id: "01FGCM1XB0C2ZW3HJ33HJYP6N8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2021-09-24T12:15:00-05:00"
recorded: "2021-09-24T14:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 150/87, repeat 147/86, pulse 88, wt 164 lb.
Labs 9/21: eGFR 63, K 4.8, UACR 241 mg/g, A1c 7%.
BP above goal, lisinopril changed to 20 mg daily today.
Pt agrees. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092441",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092441",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092441",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
