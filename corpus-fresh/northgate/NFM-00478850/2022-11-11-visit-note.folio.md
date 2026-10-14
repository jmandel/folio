---
folio: "0.1"
id: "01GHM88V902WY9A61ADRN75R4K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2022-11-11T12:15:00-06:00"
recorded: "2022-11-11T15:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no complaints.
BP 128/85, pulse 85, wt 160 lb.
Labs 11/6: eGFR 68, K 4.5, A1c 7.8%.
Stable, no changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111125",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111125",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
