---
folio: "0.1"
id: "01H0TN8NZ0B4M6V27515X9B1VJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103176"
effective: "2023-05-19T08:10:00-05:00"
recorded: "2023-05-19T13:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 158/88, repeat 154/85. Pulse 64, wt 172 lb.

Labs 5/14: eGFR 96, K 4.1, A1c 7.6%.

BP above goal, lisinopril dose changed to 40 mg daily today.

Pt agrees. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051923",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051923",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
