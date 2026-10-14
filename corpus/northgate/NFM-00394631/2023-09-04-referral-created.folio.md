---
folio: "0.1"
id: "01H9GR8G90HW0A3DYJBJ13BZR3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00394631"
effective: "2023-09-04T13:45:00-05:00"
recorded: "2023-09-04T13:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this patient. <ref id="referral">Referral for CKD evaluation and management: eGFR 43, UACR 229 mg/g.</ref>

Pt has chronic kidney disease stage 3a and essential hypertension. Kidney function has stayed reduced across recent checks, and albuminuria is present. I would appreciate your assessment and recommendations for ongoing management.

Please send your notes to our office. Happy to answer any questions.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1273",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 229 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1273",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1273",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
