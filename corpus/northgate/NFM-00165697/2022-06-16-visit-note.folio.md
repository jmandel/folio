---
folio: "0.1"
id: "01G5PR05R0YZTDXJYPAH2ZR127"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2022-06-16T09:45:00-05:00"
recorded: "2022-06-16T12:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine.
BP 124/77, pulse 83, wt 218 lb.
Labs today: eGFR 62, K 4.2, UACR 248 mg/g, A1c 7.9%.
Reviewed trend in A1c and UACR with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-061641",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-061641",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
