---
folio: "0.1"
id: "01JZ1FKJY0DEMG7XW9P9N2CT46"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00223606"
effective: "2025-06-30T12:20:00-05:00"
recorded: "2025-06-30T17:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 141/87, pulse 62, wt 199 lb.

Labs today: eGFR 64, K 4.3, LDL 113 mg/dL.

BP above goal, so lisinopril changed to 40 mg daily today.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-063088",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-063088",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-063088",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-063088",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
