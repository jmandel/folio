---
folio: "0.1"
id: "01JCSEFTP05QFE2QMC1JJAHFX9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2024-11-15T15:00:00-06:00"
recorded: "2024-11-15T20:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Tolerating the weekly injection, no complaints.
BP 141/78, pulse 81, wt 165 lb.
eGFR 57, K 4, A1c 7.3% today, LDL 153 mg/dL.
A1c improved. eGFR lower than before, will repeat.
RTC 5-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111556",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111556",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-111556",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
