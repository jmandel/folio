---
folio: "0.1"
id: "01JJD3WHG0ZK1PZ4RD5EQRTE5B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2025-01-24T10:40:00-06:00"
recorded: "2025-01-24T15:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 137/85, pulse 69, wt 153 lb.
Labs 1/20: eGFR 42, K 5.2, UACR 819 mg/g, A1c 7.2%, LDL 135 mg/dL.
Insulin glargine started today, 10 units at bedtime (A1c 7.4). Reviewed injection technique and low sugar symptoms with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012484",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012484",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-012484",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-012484",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
