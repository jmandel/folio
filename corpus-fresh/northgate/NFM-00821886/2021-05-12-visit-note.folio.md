---
folio: "0.1"
id: "01F5HB39C0FKY2XT3T1ZSFMABJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2021-05-12T14:00:00-05:00"
recorded: "2021-05-12T17:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Tolerating treatment, no complaints.
BP 132/87, pulse 77, wt 189 lb.
eGFR 86, K 4.3, UACR 35 mg/g, A1c 6.9%, at goal.
Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051222",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051222",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
