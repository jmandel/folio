---
folio: "0.1"
id: "01FZ1EXF10BKT9M1WJVF2TJ8ZV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00234334"
effective: "2022-03-25T11:10:00-05:00"
recorded: "2022-03-25T16:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new complaints.
BP 138/86, pulse 63, wt 186 lb.
Labs 3/22: eGFR 66, K 4.6, UACR 443 mg/g, A1c 7.4%.
Reviewed results with pt, A1c improved.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032511",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032511",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
