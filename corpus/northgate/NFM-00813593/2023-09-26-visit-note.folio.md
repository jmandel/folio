---
folio: "0.1"
id: "01HB9KB6F0Y9K65A4JAH43RC3S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2023-09-26T11:50:00-05:00"
recorded: "2023-09-26T15:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No hypoglycemia sx.
BP 137/83, pulse 84, wt 223 lb.
Labs 9/24: eGFR 65, K 4.4, A1c 7.6%.
A1c a bit better. Continue current plan.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092616",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092616",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
