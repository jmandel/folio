---
folio: "0.1"
id: "01KT4SMVN0QW3H21Y8N6N64EF1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2026-06-02T08:20:00-05:00"
recorded: "2026-06-02T13:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 134/74, pulse 82, wt 195 lb.

Feels well overall. Exam unremarkable, heart and lungs clear.

Wt up a few lb since last visit, discussed diet and activity.

RTC 3 mo for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-060211",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-060211",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-060211",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-060211",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
