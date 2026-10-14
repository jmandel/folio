---
folio: "0.1"
id: "01J0PV0ZS0ADSVK3YGM574EH18"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00911754"
effective: "2024-06-18T15:00:00-05:00"
recorded: "2024-06-18T18:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Doing well, no new complaints.
BP 113/63, pulse 71, wt 187 lb.
Exam unremarkable.
Reviewed med list, no changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061838",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-061838",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-061838",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
