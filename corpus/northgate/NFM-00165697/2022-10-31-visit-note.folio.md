---
folio: "0.1"
id: "01GGQJM7A0CQQPW0S5NJ3SH0HR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2022-10-31T08:40:00-05:00"
recorded: "2022-10-31T12:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 126/76, pulse 65, wt 214 lb.
Labs 10/25: eGFR 60, K 4.2, UACR 211 mg/g, A1c 7.3%.
A1c better than last visit. Pt pleased.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-103155",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-103155",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
