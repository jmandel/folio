---
folio: "0.1"
id: "01JZ3HR9A0M3YWJF32RQK329BZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2025-07-01T09:15:00-05:00"
recorded: "2025-07-01T12:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feeling well, no new complaints.

BP 127/80, pulse 77, wt 183 lb. Exam unremarkable.

Labs today: eGFR 82, K 4.6, A1c 7.3%, LDL 84 mg/dL. Reviewed with pt.

Continue current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070143",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070143",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-070143",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
