---
folio: "0.1"
id: "01GBXF4Z901BDGYTX2568S5T7R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00345310"
effective: "2022-09-01T16:25:00-05:00"
recorded: "2022-09-01T16:26:12-05:00"
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

<ref id="referral">Thank you for seeing this patient, a new patient to our practice with chronic kidney disease, type 2 diabetes and essential hypertension. Labs show eGFR 44 and UACR 174 mg/g. I am referring for CKD evaluation and management. Please send your recommendations when you have seen them, and we will continue to follow BP and diabetes here.</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-0744",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 174 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0744",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0744",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0744",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
