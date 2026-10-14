---
folio: "0.1"
id: "01J0CRZT50QN3VYWN38AW5CJNB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2024-06-14T15:50:00-05:00"
recorded: "2024-06-14T20:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP up today.
BP 148/92, pulse 83, wt 249 lb.
Labs 6/11: eGFR 52, K 4.2.
Pt to check BP at home and bring readings. Will recheck sooner.
RTC 2 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061469",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061469",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
