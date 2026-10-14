---
folio: "0.1"
id: "01FX3B4TF0K6NWR0C107P3SFXV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2022-03-01T12:15:00-06:00"
recorded: "2022-03-01T12:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this patient, a new patient to our practice with type 2 diabetes and essential hypertension. Labs today show chronic kidney disease: <ref id="referral">eGFR 42 and UACR 260 mg/g. Requesting CKD evaluation and management.</ref>

BP has been in the 130s/80 range. Please advise on work-up and ongoing care of the kidney disease. Recent labs will be sent along with this letter.

Thank you,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1666",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 260 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1666",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1666",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1666",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
