---
folio: "0.1"
id: "01K867M6G0WQYGR5DZH6MGNZC9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2025-10-22T08:00:00-05:00"
recorded: "2025-10-22T10:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/79, pulse 80, wt 160 lb.
A1c 8.4% today, up. eGFR 31, K 4.8, LDL 138.
Went over diet and adherence with pt. Kidney fn still trending down.
RTC 3 mo with repeat A1c.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102298",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-102298",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-102298",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-102298",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
