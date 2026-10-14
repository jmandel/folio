---
folio: "0.1"
id: "01K9V06M20V74HMTRQ3SS6YYCJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2025-11-11T15:10:00-06:00"
recorded: "2025-11-11T21:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 129/80, pulse 79, wt 190 lb.

BP improved from last visit. Pt feels well, no dizziness.

Continue current plan.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-111162",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-111162",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
