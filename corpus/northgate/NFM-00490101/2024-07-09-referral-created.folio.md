---
folio: "0.1"
id: "01J2C5MJ30Q3DRWPSQGTEMA6WA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490101"
effective: "2024-07-09T11:35:00-05:00"
recorded: "2024-07-09T11:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleague,

Thank you for seeing this new patient of our practice, who has essential hypertension and chronic kidney disease. <ref id="referral">eGFR 41 and UACR 11 mg/g on labs drawn 7/9. Requesting CKD evaluation and management.</ref>

BP in the office today was 141/85, repeat 139/82. Potassium was 4.6. Records from before this practice are limited and the history is per the patient.

Please send your recommendations to our office. We will continue to follow BP here in the meantime.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1753",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 41, UACR 11 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1753",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1753",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
