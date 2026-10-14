---
folio: "0.1"
id: "01KT5K3NW0VXNDHDJCAH0VGKFN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00978964"
effective: "2026-06-02T14:40:00-05:00"
recorded: "2026-06-02T20:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 145/90, pulse 85, wt 177 lb.
Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
Labs 5/30: eGFR 42, K 4.3, A1c 6.8%, LDL 85 mg/dL.
Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-060231",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-060231",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-060231",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-060231",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-060231",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
