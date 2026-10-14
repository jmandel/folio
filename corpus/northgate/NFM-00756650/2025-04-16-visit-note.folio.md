---
folio: "0.1"
id: "01JRZTVP60VN4HJYBKCXE1B71N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00756650"
effective: "2025-04-16T10:00:00-05:00"
recorded: "2025-04-16T12:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 125/70, pulse 66, wt 204 lb.
Labs today: A1c 6.2%, eGFR 54, K 4.4.
CKD stage 3a, eGFR unchanged from last visit.
Pt doing well, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041649",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041649",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-041649",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
