---
folio: "0.1"
id: "01JHGR112065M00MM70T2QP8B9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2025-01-13T09:45:00-06:00"
recorded: "2025-01-13T15:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 144/85, repeat 141/83, pulse 71, wt 174 lb.
Labs today: eGFR 46, K 4.5, UACR 51 mg/g.
BP above goal, losartan started 50 mg daily today.
Pt agrees. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011353",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011353",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
