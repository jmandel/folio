---
folio: "0.1"
id: "01F1ZPAYD0V36KEPPPS6GCWD10"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493571"
effective: "2021-03-29T09:00:00-05:00"
recorded: "2021-03-29T14:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 120/76, pulse 75, wt 165 lb.
Labs today: eGFR 50, K 4.7, UACR 127 mg/g, A1c 7.7%.
UACR up from last check, will repeat. Diet reviewed. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-032975",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-032975",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-032975",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
