---
folio: "0.1"
id: "01H2HFBNC06ZRBTS61TAJZ7RNW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00003054"
effective: "2023-06-09T15:40:00-05:00"
recorded: "2023-06-09T20:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 137/83, pulse 79, wt 179 lb.

eGFR 59, K 4.2, UACR 144 mg/g today.

Will recheck labs and BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-060995",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-060995",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
