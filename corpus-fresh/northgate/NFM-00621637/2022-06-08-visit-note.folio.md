---
folio: "0.1"
id: "01G530QZG0311D0WJRRRE0BS9D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2022-06-08T15:30:00-05:00"
recorded: "2022-06-08T20:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new sx.

BP 148/89, pulse 81, wt 192 lb.

Labs 6/6: eGFR 66, K 4.5, UACR 77 mg/g, A1c 7.8%.

BP up today, will recheck at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-060826",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-060826",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
