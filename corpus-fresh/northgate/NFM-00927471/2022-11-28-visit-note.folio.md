---
folio: "0.1"
id: "01GK02R030XG5SENJ72T1D59T7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927471"
effective: "2022-11-28T09:40:00-06:00"
recorded: "2022-11-28T15:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 147/88, repeat 141/85, pulse 67, wt 151 lb.
Labs 11/22: eGFR 93, K 4.5, A1c 8.1%.
A1c up, metformin changed to 1000 mg BID today.
Diet and activity reviewed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112863",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112863",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
