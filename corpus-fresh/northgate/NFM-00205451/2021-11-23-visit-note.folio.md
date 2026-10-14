---
folio: "0.1"
id: "01FN71AMM0XJ9WYQH6ZNASP2JM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2021-11-23T10:45:00-06:00"
recorded: "2021-11-23T12:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 138/85, pulse 76, wt 130 lb.
eGFR 83, K 4.3 today.
BP much improved, no new complaints.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112381",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112381",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
