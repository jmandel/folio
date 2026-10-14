---
folio: "0.1"
id: "01JYFQD700YWZKTWBE7Q84QV33"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591128"
effective: "2025-06-23T14:00:00-05:00"
recorded: "2025-06-23T20:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt doing well, no new complaints.

BP 117/65, pulse 64, wt 188 lb.

Exam unremarkable. Routine health maintenance discussed.

RTC 1 yr, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-062372",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-062372",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
