---
folio: "0.1"
id: "01FJYGFDV0Y5J3KXHJHVMB1V1S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2021-10-26T09:35:00-05:00"
recorded: "2021-10-26T09:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this patient with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Labs today show eGFR 47 and UACR 446 mg/g. We are asking for CKD evaluation and management.</ref>

Kidney function has been fairly stable over the past year, but albuminuria remains persistently elevated. Blood pressure today was 123/70. I would appreciate your recommendations on further workup and treatment, and I am glad to continue day-to-day diabetes and blood pressure care here.

Please send your notes to our office. Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0953",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 446 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
