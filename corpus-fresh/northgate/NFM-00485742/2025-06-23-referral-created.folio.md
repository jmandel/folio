---
folio: "0.1"
id: "01JYF2Y250F6PEB111G5QEN4DE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2025-06-23T14:05:00-05:00"
recorded: "2025-06-23T14:06:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleague,

Thank you for seeing this patient, a pt of mine with type 2 diabetes, essential hypertension and chronic kidney disease stage 3a. <ref id="referral">eGFR 54, UACR 335 mg/g: referring for CKD evaluation and management.</ref>

Kidney function has been fairly stable on our recent checks, but albuminuria persists. I would appreciate your assessment and any recommendations for ongoing management. Recent labs are available in the chart. Pt is aware of the referral and agrees.

Please call with any questions.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-1154",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 54, UACR 335 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1154",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1154",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1154",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
