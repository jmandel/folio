---
folio: "0.1"
id: "01GPYJVSH0JT23V403HC73VDYT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2023-01-16T12:30:00-06:00"
recorded: "2023-01-16T18:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports no low sugars.
BP 122/68, pulse 77, wt 186 lb.
1/10 labs: A1c 7.4%, eGFR 56, K 4.4.
Stable, no changes today. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011674",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011674",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
