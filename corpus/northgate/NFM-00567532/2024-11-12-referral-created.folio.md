---
folio: "0.1"
id: "01JCH4K980G5JNWC9YSGZDG1C0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00567532"
effective: "2024-11-12T15:30:00-06:00"
recorded: "2024-11-12T15:31:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleagues,

Thank you for seeing this patient, a new patient to our practice with chronic kidney disease and essential hypertension. <ref id="referral">eGFR 43 and UACR 530 mg/g. Requesting CKD evaluation and management.</ref>

Blood pressure has been above goal at our visit. Please advise on workup and any recommendations for ongoing kidney care. We will continue to manage the hypertension here and can share records as needed.

Thank you for your help.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0706",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 530 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0706",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0706",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
