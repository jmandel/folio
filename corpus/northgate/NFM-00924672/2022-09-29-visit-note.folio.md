---
folio: "0.1"
id: "01GE5XHEH019G90BJKTQ1AKH0Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924672"
effective: "2022-09-29T15:00:00-05:00"
recorded: "2022-09-29T19:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.

BP 123/71, pulse 70, wt 179 lb.
Today eGFR 62, K 4.3, UACR 10 mg/g.

Results reviewed with pt, stable. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-092989",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-092989",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
