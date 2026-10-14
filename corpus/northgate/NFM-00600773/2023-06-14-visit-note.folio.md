---
folio: "0.1"
id: "01H2XYMRJ03NSG7ZDVB62NFQ0M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00600773"
effective: "2023-06-14T13:45:00-05:00"
recorded: "2023-06-14T16:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 134/75, pulse 88, wt 142 lb.
6/12 labs: eGFR 64, K 4.3, A1c 7.2%, LDL 99 mg/dL.

Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061483",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061483",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
