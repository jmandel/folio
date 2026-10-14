---
folio: "0.1"
id: "01K7Q47EG0JNG6MXJ9WH15MQ3X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2025-10-16T09:20:00-05:00"
recorded: "2025-10-16T13:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 125/76, pulse 86, wt 201 lb.
Labs today: eGFR 43, K 4.6, UACR 123 mg/g, A1c 8.2%.
A1c up from last visit. Discussed diet and home checks.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-101677",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-101677",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-101677",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
