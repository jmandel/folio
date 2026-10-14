---
folio: "0.1"
id: "01FDW9E4V0C4HA74C5E5PXNZHV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2021-08-24T09:35:00-05:00"
recorded: "2021-08-24T09:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt, a new patient to our practice with type 2 diabetes and essential hypertension. <ref id="referral">Referring for CKD evaluation and management: eGFR 43, UACR 10 mg/g.</ref>

Kidney function was checked at the establish-care visit today. We would appreciate your recommendations on workup and ongoing management of the kidney disease alongside his diabetes and BP care. Pt is aware of the referral and agreeable.

Please send your notes to our office. Call with any questions.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1920",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 10 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1920",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1920",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1920",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
