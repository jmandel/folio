---
folio: "0.1"
id: "01H5QXZE20GX74GPHTGNMD5TYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00016041"
effective: "2023-07-19T12:45:00-05:00"
recorded: "2023-07-19T15:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new concerns.
BP 133/82, pulse 83, wt 190 lb.
Labs today: eGFR 83, K 4.3, A1c 6.7%.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071943",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-071943",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
