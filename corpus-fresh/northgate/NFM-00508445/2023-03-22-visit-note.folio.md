---
folio: "0.1"
id: "01GW5KY8X06K4VTGF0D95PWQQF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2023-03-22T13:00:00-05:00"
recorded: "2023-03-22T16:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 133/84, pulse 66, wt 250 lb.
Labs today: eGFR 54, K 4.4, UACR 233 mg/g.
Reviewed with pt. Will recheck in a few months.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032287",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032287",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
