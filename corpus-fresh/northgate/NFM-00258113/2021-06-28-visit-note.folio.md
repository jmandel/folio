---
folio: "0.1"
id: "01F9AEXS1072KEKJC7S305S36Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2021-06-28T12:40:00-05:00"
recorded: "2021-06-28T18:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no hypoglycemia reported.
BP 114/75, pulse 88, wt 170 lb.
Today: eGFR 62, K 4.3, A1c 7.5%, LDL 91.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-062815",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-062815",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
