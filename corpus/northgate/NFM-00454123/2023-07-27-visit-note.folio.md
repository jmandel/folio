---
folio: "0.1"
id: "01H6CHG5M0ZA403TQZVEADR2XN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2023-07-27T10:45:00-05:00"
recorded: "2023-07-27T15:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well, no new complaints.

BP 131/78, pulse 63, wt 199 lb.

Labs 7/23: eGFR 98, K 4.8, A1c 7%.

Reviewed results with pt. RTC as scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072785",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072785",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-072785",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-072785",
    "rank": 3,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
