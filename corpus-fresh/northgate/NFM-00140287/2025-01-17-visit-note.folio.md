---
folio: "0.1"
id: "01JHVAWH80YNMNDE4YKKT9B6Q0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2025-01-17T13:30:00-06:00"
recorded: "2025-01-17T17:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 139/85, pulse 65, wt 162 lb.
Labs 1/11: eGFR 35, K 4.8, UACR 505 mg/g, A1c 7.4%.
Kidney fn slowly drifting down, albuminuria persists. Discussed with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011767",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011767",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-011767",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
