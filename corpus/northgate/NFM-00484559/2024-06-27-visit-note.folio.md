---
folio: "0.1"
id: "01J1DTA1F0XTS9ATN31ACREHTG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2024-06-27T10:20:00-05:00"
recorded: "2024-06-27T16:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 129/81, pulse 67, wt 179 lb.
Labs today: eGFR 54, K 4.2, A1c 7.4%.
Stable, no changes. Pt doing well.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062792",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062792",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
