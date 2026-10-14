---
folio: "0.1"
id: "01K05EHDM0A5K8AWGS9N9VZ8JB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2025-07-14T12:45:00-05:00"
recorded: "2025-07-14T16:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new complaints.

BP 120/77, pulse 85, wt 168 lb.
Labs 7/10: eGFR 63, K 4.8. Reviewed with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071498",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071498",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
