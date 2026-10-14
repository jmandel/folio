---
folio: "0.1"
id: "01JZNZGZ30QGNGHNRJ79ESYAR9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2025-07-08T10:50:00-05:00"
recorded: "2025-07-08T16:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns.
BP 148/94, repeat 144/93, pulse 65, wt 185 lb.
7/3 labs: eGFR 72, K 4.6, UACR 85 mg/g, A1c 7%, LDL 144 mg/dL.
BP above goal, A1c up a bit from last, LDL high. Discussed diet and exercise.
RTC 3 mo to recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070874",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070874",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-070874",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-070874",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
