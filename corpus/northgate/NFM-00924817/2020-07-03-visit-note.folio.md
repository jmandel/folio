---
folio: "0.1"
id: "01ECB54M0008VS5HS108HE6244"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2020-07-03T10:30:00-05:00"
recorded: "2020-07-03T15:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new complaints.
BP 128/75, pulse 81, wt 243 lb.
Labs 6/28: eGFR 98, K 4.2.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070334",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070334",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
