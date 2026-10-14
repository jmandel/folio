---
folio: "0.1"
id: "01K2DNV6Z0D7N12B6W04HED034"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00343326"
effective: "2025-08-11T15:10:00-05:00"
recorded: "2025-08-11T18:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 150/95, pulse 62, wt 192 lb. BP high today, will recheck at next visit.
Labs today: eGFR 99, K 4.6, A1c 7.1%.
Pt aware of results.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081171",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081171",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
